#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

struct User {
    char name[50];
    char email[50];
    char username[30];
    char mobile[15];
    char password[30];
    char confirm_password[30];
    double balance;
};

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
    struct User user;
    char *len;
    int contentLength;
    FILE *fp;

    printf("Content-Type: text/html\n\n");

    len = getenv("CONTENT_LENGTH");
    if (!len) {
        printf("<h3>Error! No data received.</h3>");
        return 1;
    }

    contentLength = atoi(len);
    if (contentLength <= 0 || contentLength > 1024) {
        printf("<h3>Invalid content length!</h3>");
        return 1;
    }

    char input[1024] = {0};
    fread(input, 1, contentLength, stdin);

    char decoded[1024];
    decode(input, decoded);

    // data parse
    sscanf(decoded, "name=%[^&]&username=%[^&]&email=%[^&]&mobile=%[^&]&password=%[^&]&confirm_password=%s",
           user.name, user.username, user.email, user.mobile, user.password, user.confirm_password);

    // password match check
    if (strcmp(user.password, user.confirm_password) != 0) {
        printf("<h2>Password and Confirm Password do not match.</h2>");
        printf("<a href='/DSproject/registration.html'>Try Again</a>");
        return 1;
    }

    fp = fopen("C:/xampp/htdocs/data/registration.txt", "a");
    if (fp == NULL) {
        printf("<h3>Error saving registration!</h3>");
        perror("fopen error");
        return 1;
    }

    fprintf(fp, "%s|%s|%s|%s|%s|%.2f\n", user.name, user.email, user.username, user.mobile, user.password, 0.00);
    fclose(fp);

    printf("<h2>Registration Successful!</h2>");
    printf("<p>Welcome, <b>%s</b>. Your account has been created successfully.</p>", user.name);
    printf("<a href='/DSproject/login.html'>Go to Login</a>");
    return 0;
}
