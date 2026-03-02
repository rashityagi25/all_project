#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

// URL decode function
void decode(char *src) {
    char *p = src;
    char code[3] = {0};
    char *dest = src;

    while (*p) {
        if (*p == '+') {
            *dest++ = ' ';
        } else if (*p == '%' && isxdigit(*(p + 1)) && isxdigit(*(p + 2))) {
            code[0] = *(p + 1);
            code[1] = *(p + 2);
            *dest++ = (char)strtol(code, NULL, 16);
            p += 2;
        } else {
            *dest++ = *p;
        }
        p++;
    }
    *dest = '\0';
}

// Card validation (16 digits)
int isValidCard(const char *card) {
    if (strlen(card) != 16) return 0;
    for (int i = 0; i < 16; i++) {
        if (!isdigit(card[i])) return 0;
    }
    return 1;
}

// CVV validation (3-4 digits)
int isValidCVV(const char *cvv) {
    int len = strlen(cvv);
    if (len < 3 || len > 4) return 0;
    for (int i = 0; i < len; i++) {
        if (!isdigit(cvv[i])) return 0;
    }
    return 1;
}

int main() {
    char *len = getenv("CONTENT_LENGTH");
    int contentLength = len ? atoi(len) : 0;

    printf("Content-Type: text/html\n\n");

    if (contentLength <= 0) {
        printf("<h3>Error: No data received.</h3>");
        return 1;
    }

    char postData[1024] = {0};
    fread(postData, 1, contentLength, stdin);

    // Variables to hold form data
    char username[50], train_id[20], card[20], expiry[10], cvv[5];
    int seat_no;

    // Parse form data
    sscanf(postData, "username=%[^&]&train_id=%[^&]&seat_no=%d&card=%[^&]&expiry=%[^&]&cvv=%s",
           username, train_id, &seat_no, card, expiry, cvv);

    // Decode URL encoded data
    decode(username);
    decode(train_id);
    decode(card);
    decode(expiry);
    decode(cvv);

    // Validate card and CVV
    if (!isValidCard(card)) {
        printf("<h2>Invalid Card Number. Must be 16 digits.</h2>");
        return 0;
    }

    if (!isValidCVV(cvv)) {
        printf("<h2>Invalid CVV. Must be 3 or 4 digits.</h2>");
        return 0;
    }

    // Get last 4 digits of card
    char last4[5];
    strncpy(last4, card + 12, 4);
    last4[4] = '\0';

    // Open payments.txt file to save transaction
    FILE *fp = fopen("C:/xampp/htdocs/data/payments.txt", "a");
    if (!fp) {
        printf("<h3>Error: Could not open payment record file.</h3>");
        return 1;
    }

    fprintf(fp, "%s %s %d **** **** **** %s\n", username, train_id, seat_no, last4);
    fclose(fp);

    // Payment success message
    printf("<h2>Payment Successful!</h2>");
    printf("<p>Thank you <b>%s</b>. Your ticket for Train <b>%s</b> Seat <b>%d</b> is confirmed.</p>", username, train_id, seat_no);
    printf("<p>Card ending with <b>%s</b> charged.</p>", last4);
printf("<a href='/DSproject/booking.html'>Book another ticket</a>");



    return 0;
}
