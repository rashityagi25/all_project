#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_USERS 100
#define DATA_FILE "C:/xampp/htdocs/data/registration.txt"

// User structure according to registration.txt
struct User {
    char name[50];
    char email[50];
    char username[30];
    char mobile[15];
    char password[30];
    double balance;
};

// URL decode function
void decode(char *src, char *dest) {
    char *p = src;
    char code[3] = {0};
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

int main() {
    struct User userList[MAX_USERS];
    int userCount = 0;
    char *input, decoded[300];
    char username[30];
    double rechargeAmount;
    FILE *fp;

    printf("Content-Type: text/html\n\n");

    input = getenv("QUERY_STRING");
    if (!input) {
        printf("<h3>Error: No data received.</h3>");
        return 1;
    }

    // Decode the full query string once
    decode(input, decoded);
    sscanf(decoded, "username=%[^&]&amount=%lf", username, &rechargeAmount);

    if (rechargeAmount <= 0) {
        printf("<h3>Error: Invalid recharge amount!</h3>");
        return 1;
    }

    // Read existing users from file
    fp = fopen(DATA_FILE, "r");
    if (!fp) {
        printf("<h3>Error: User data not found.</h3>");
        return 1;
    }

    while (fscanf(fp, "%[^|]|%[^|]|%[^|]|%[^|]|%[^|]|%lf\n",
                  userList[userCount].name,
                  userList[userCount].email,
                  userList[userCount].username,
                  userList[userCount].mobile,
                  userList[userCount].password,
                  &userList[userCount].balance) == 6)
    {
        userCount++;
        if (userCount >= MAX_USERS) {
            printf("<h3>Error: User limit exceeded!</h3>");
            fclose(fp);
            return 1;
        }
    }
    fclose(fp);

    // Update balance for matching user (case-insensitive)
    int found = 0;
    for (int i = 0; i < userCount; i++) {
        if (_stricmp(userList[i].username, username) == 0) {
            userList[i].balance += rechargeAmount;
            found = 1;
            break;
        }
    }

    if (!found) {
        printf("<h3>Error: User not found!</h3>");
        return 1;
    }

    // Save updated data back to file
    fp = fopen(DATA_FILE, "w");
    if (!fp) {
        printf("<h3>Error saving recharge!</h3>");
        return 1;
    }

    for (int i = 0; i < userCount; i++) {
        fprintf(fp, "%s|%s|%s|%s|%s|%.2f\n",
                userList[i].name,
                userList[i].email,
                userList[i].username,
                userList[i].mobile,
                userList[i].password,
                userList[i].balance);
    }
    fclose(fp);

    // Final success message
    printf("<h2>Recharge Successful!</h2>");
    printf("<p>User <b>%s</b> recharged with ₹%.2f successfully!</p>", username, rechargeAmount);
    printf("<a href='/DSproject/home.html'>Go to Home</a>");

    return 0;
}
