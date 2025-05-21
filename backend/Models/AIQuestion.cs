using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class AIQuestion
    {
        public int Id { get; set; }

        public string UserId { get; set; }

        public string Mode { get; set; }

        public string Prompt { get; set; }

        public string Input { get; set; }

        public string Response { get; set; }

    }
}
