using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/aiquestions")]
    [Authorize]
    public class AIQuestionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AIQuestionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var questions = await _context.AIQuestions
                .Where(q => q.UserId == userId)
                .ToListAsync();

            return Ok(questions);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Save([FromBody] AIQuestionDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var question = new AIQuestion
            {
                Mode = dto.Mode,
                Input = dto.Input,
                Prompt = dto.Prompt,
                Response = dto.Response,
                UserId = userId
            };

            _context.AIQuestions.Add(question);
            await _context.SaveChangesAsync();

            return Ok(question);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var question = await _context.AIQuestions.FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (question == null)
                return NotFound();

            _context.AIQuestions.Remove(question);
            await _context.SaveChangesAsync();

            return Ok();
        }



    }
}
