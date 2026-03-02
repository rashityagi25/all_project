#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <errno.h>

// URL decode function
void decode(char *src, char *dest) {
    char *p = src;
    char code[3] = {0};
    while (*p) {
        if (*p == '+') {
            *dest++ = ' ';
        } else if (*p == '%' && isxdigit(*(p+1)) && isxdigit(*(p+2))) {
            code[0] = *(p+1);
            code[1] = *(p+2);
            *dest++ = (char)strtol(code, NULL, 16);
            p += 2;
        } else {
            *dest++ = *p;
        }
        p++;
    }
    *dest = '\0';
}

int main() {
    char *len = getenv("CONTENT_LENGTH");
    int contentLength = len ? atoi(len) : 0;
    char postData[1024] = {0};

    fread(postData, 1, contentLength, stdin);

    // Variables matching your form fields
    char name[50] = {0}, source[50] = {0}, destination[50] = {0}, date[20] = {0};

    // Decode postData first
    char decoded[1024] = {0};
    decode(postData, decoded);

    printf("Content-Type: text/html\n\n");

    // Print POST data for debugging
    printf("<pre>POST Data: %s</pre>", postData);
    printf("<pre>Decoded Data: %s</pre>", decoded);

    // Parse form data
    sscanf(decoded, "name=%[^&]&source=%[^&]&destination=%[^&]&date=%s", name, source, destination, date);

    // Simple validation
    if (strlen(name) == 0 || strlen(source) == 0 || strlen(destination) == 0 || strlen(date) == 0) {
        printf("<h2>All fields are required!</h2>");
        printf("<a href='/www/booking.html'>Go back</a>");
        return 1;
    }

    // Absolute path to booking file
    const char *filePath = "C:/xampp/htdocs/data/bookings.txt";

    FILE *fp = fopen(filePath, "a");
    if (!fp) {
        printf("<h2>Error saving booking!</h2>");
        printf("<p>Unable to open file: %s</p>", strerror(errno));
        return 1;
    }
    fprintf(fp, "Name:%s Source:%s Destination:%s Date:%s\n", name, source, destination, date);
    fclose(fp);

    printf("<h2>Ticket booked successfully!</h2>");
    printf("<p>Name: %s</p>", name);
    printf("<p>From: %s</p>", source);
    printf("<p>To: %s</p>", destination);
    printf("<p>Date: %s</p>", date);
    printf("<a href='/DSproject/pay.html'>Proceed to Payment</a>");

    return 0;
}
