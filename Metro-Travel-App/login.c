#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void decode(char *src, char *dest) {
    char *p = src;
    char code[3] = {0};
    while (*p) {
        if (*p == '+') {
            *dest++ = ' ';
        } else if (*p == '%') {
            sscanf(p + 1, "%2s", code);
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

    int contentLength = len? atoi(len) : 0;
if (contentLength <= 0 || contentLength >= 1024) {
    printf("Content-Type: text/html\n\n");
    printf("<h2>Error: Invalid content length</h2>");
    return 1;
}

    char postData[1024] = {0};
    fread(postData, 1, contentLength, stdin);

    char decodedData[1024] = {0};
    decode(postData, decodedData);

    char username[50], password[50];
    sscanf(decodedData, "username=%[^&]&password=%s", username, password);

    char fileName[50], fileEmail[50], fileUser[50], filePhone[50], filePass[50];
    double fileBalance;
    int success = 0;

    FILE *fp = fopen("c:/xampp/htdocs/data/registration.txt", "r");
    if (fp) {
        while (fscanf(fp, "%[^|]|%[^|]|%[^|]|%[^|]|%[^|]|%lf\n",
                      fileName, fileEmail, fileUser, filePhone, filePass, &fileBalance) == 6) {
            if (strcmp(username, fileUser) == 0 && strcmp(password, filePass) == 0) {
                success = 1;
                break;
            }
        }
        fclose(fp);
    }

    printf("Content-Type: text/html\n\n");

    if (success)
        printf("<h2>Login successful! Welcome, %s</h2><a href='/DSproject/router.html'>Go to Metro Route Planner</a>", username);
    else
        printf("<h2>Login failed. Invalid username or password.</h2>");

    return 0;
}
