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
    char data[200];
    char source[50], destination[50];
    char *input;

    printf("Content-type: text/html\n\n");

    input = getenv("QUERY_STRING");

    if (!input) {
        printf("<h3>Error! No data received.</h3>");
        return 1;
    }

    char decoded[200];
    decode(input, decoded);

    sscanf(decoded, "source=%[^&]&destination=%[^&]", source, destination);

    printf("<h2>Metro Route</h2>");
    printf("<p>From: <b>%s</b></p>", source);
    printf("<p>To: <b>%s</b></p>", destination);

    // Future: yaha Dijkstra ya route list bhi dikha sakte ho

    printf("<p>Your route from <b>%s</b> to <b>%s</b> has been planned successfully!</p>", source, destination);

    return 0;
}
