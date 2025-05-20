namespace backend.Models
{
    public class CommonRegex
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Pattern { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCaseInsensitive { get; set; } = false;
    }

}
