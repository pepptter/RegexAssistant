using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class RegexPattern
    {
        public int Id { get; set; }

        [Required]
        public string Pattern { get; set; } = null!;

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string? UserId { get; set; }

        public string? SavedExplanation { get; set; }


        [NotMapped]
        public bool IsGlobal => string.IsNullOrEmpty(UserId);
    }
}
