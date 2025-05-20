using backend.Models;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void SeedPublicRegexes(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            if (context.RegexPatterns.Any(r => r.UserId == null))
                return;

            var commonRegexes = new List<RegexPattern>
            {
                new RegexPattern
                {
                    Name = "Email Address",
                    Pattern = @"^[\w.-]+@[\w.-]+\.\w{2,}$",
                    Description = "Matches a standard email address."
                },
                new RegexPattern
                {
                    Name = "URL",
                    Pattern = @"https?:\/\/(www\.)?[\w-]+\.[\w.-]+[\w\-._~:/?#[\]@!$&'()*+,;=.]*",
                    Description = "Matches HTTP or HTTPS URLs."
                },
                new RegexPattern
                {
                    Name = "Phone Number (Swedish)",
                    Pattern = @"^(\+46|0)[ -]?(\d{1,3})[ -]?(\d{1,4})[ -]?(\d{2,4})$",
                    Description = "Matches Swedish phone numbers with optional country code +46."
                },
                new RegexPattern
                {
                    Name = "Date (YYYY-MM-DD)",
                    Pattern = @"^\d{4}-\d{2}-\d{2}$",
                    Description = "Matches dates in the format 2023-04-30."
                },
                new RegexPattern
                {
                    Name = "IPv4 Address",
                    Pattern = @"^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$",
                    Description = "Matches IPv4 addresses."
                },
                new RegexPattern
                {
                    Name = "Hex Color",
                    Pattern = @"^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
                    Description = "Matches 3 or 6 digit hexadecimal color codes."
                },
                new RegexPattern
                {
                    Name = "Postal Code (Sweden)",
                    Pattern = @"^\d{3} ?\d{2}$",
                    Description = "Matches Swedish postal codes (e.g. 123 45 or 12345)."
                },
                new RegexPattern
                {
                    Name = "Strong Password",
                    Pattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$",
                    Description = "At least 8 chars, 1 lowercase, 1 uppercase, 1 digit, 1 special char."
                },
                new RegexPattern
                {
                    Name = "Username (Alphanumeric + underscore, 3-16 chars)",
                    Pattern = @"^[a-zA-Z0-9_]{3,16}$",
                    Description = "Usernames with letters, numbers, and underscores only."
                },
                new RegexPattern
                {
                    Name = "Whitespace",
                    Pattern = @"\s+",
                    Description = "Matches one or more whitespace characters."
                },
                new RegexPattern
                {
                    Name = "Non-digit Characters",
                    Pattern = @"\D+",
                    Description = "Matches one or more non-digit characters."
                },
                new RegexPattern
                {
                    Name = "Floating Point Number",
                    Pattern = @"^[+-]?(\d*\.)?\d+$",
                    Description = "Matches positive or negative floating point numbers."
                },
                new RegexPattern
                {
                    Name = "HTML Tag",
                    Pattern = @"<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>",
                    Description = "Matches simple HTML tags."
                },
                new RegexPattern
                {
                    Name = "Time (24h HH:MM)",
                    Pattern = @"^(2[0-3]|[01]?[0-9]):[0-5][0-9]$",
                    Description = "Matches time in 24-hour format."
                },
                new RegexPattern
                {
                    Name = "UUID / GUID",
                    Pattern = @"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
                    Description = "Matches universally unique identifiers (UUID/GUID)."
                },
                new RegexPattern
                {
                    Name = "JSON Key",
                    Pattern = @"""([^""\\]|\\.)*""\s*:",
                    Description = "Matches JSON object keys (quoted strings followed by colon)."
                },
                new RegexPattern
                {
                    Name = "HTML Comments",
                    Pattern = @"<!--[\s\S]*?-->",
                    Description = "Matches HTML comments."
                },
                new RegexPattern
                {
                    Name = "CSS Hex Color",
                    Pattern = @"#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b",
                    Description = "Matches CSS hex color codes."
                },
                new RegexPattern
                {
                    Name = "JavaScript Variable Declaration (var/let/const)",
                    Pattern = @"\b(var|let|const)\s+[a-zA-Z_$][a-zA-Z0-9_$]*",
                    Description = "Matches JavaScript variable declarations."
                },
                new RegexPattern
                {
                    Name = "Email Address (simple)",
                    Pattern = @"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
                    Description = "Simple email validation pattern."
                },
                new RegexPattern
                {
                    Name = "URL (simple)",
                    Pattern = @"https?:\/\/[\w\-\.]+(\.[\w\-]+)+[/#?]?.*$",
                    Description = "Matches HTTP and HTTPS URLs."
                },
                new RegexPattern
                {
                    Name = "IPv4 Address",
                    Pattern = @"\b(?:\d{1,3}\.){3}\d{1,3}\b",
                    Description = "Matches IPv4 addresses."
                },
                new RegexPattern
                {
                    Name = "Semicolon at end of line",
                    Pattern = @";\s*$",
                    Description = "Matches semicolon at end of a line."
                },
                new RegexPattern
                {
                    Name = "Single-line comment (C++, Java, JS)",
                    Pattern = @"//.*",
                    Description = "Matches single line comments starting with //."
                },
                new RegexPattern
                {
                    Name = "Multi-line comment (C, Java, JS)",
                    Pattern = @"/\*[\s\S]*?\*/",
                    Description = "Matches multi-line comments enclosed by /* */."
                },
                new RegexPattern
                {
                    Name = "Function Declaration (JS/Java/C#)",
                    Pattern = @"\bfunction\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(",
                    Description = "Matches JavaScript function declarations."
                },
                new RegexPattern
                {
                    Name = "Trailing Whitespace",
                    Pattern = @"\s+$",
                    Description = "Matches trailing whitespace at end of line."
                },
                new RegexPattern
                {
                    Name = "Hexadecimal Number",
                    Pattern = @"\b0x[0-9a-fA-F]+\b",
                    Description = "Matches hexadecimal numbers starting with 0x."
                },
                new RegexPattern
                {
                    Name = "Integer Number",
                    Pattern = @"\b\d+\b",
                    Description = "Matches whole integers."
                },

            };

            context.RegexPatterns.AddRange(commonRegexes);
            context.SaveChanges();
        }
    }
}
