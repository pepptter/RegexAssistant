using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSavedExplanationToRegexPattern : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SavedAIExplanation",
                table: "RegexPatterns",
                newName: "SavedExplanation");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SavedExplanation",
                table: "RegexPatterns",
                newName: "SavedAIExplanation");
        }
    }
}
