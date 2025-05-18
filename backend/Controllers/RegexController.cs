using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/regex")]
    public class RegexController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public RegexController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirst("sub")?.Value;

            var patterns = await _context.RegexPatterns
                .Where(r => r.UserId == userId || r.UserId == null)
                .ToListAsync();

            return Ok(patterns);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Save([FromBody] RegexPattern pattern)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst("sub")?.Value;
            if (userId == null) return Unauthorized();

            pattern.UserId = userId;

            _context.RegexPatterns.Add(pattern);
            await _context.SaveChangesAsync();

            return Ok(pattern);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst("sub")?.Value;
            var pattern = await _context.RegexPatterns.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (pattern == null) return NotFound();

            _context.RegexPatterns.Remove(pattern);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublic()
        {
            var publicPatterns = await _context.RegexPatterns
                .Where(r => r.UserId == null)
                .ToListAsync();

            return Ok(publicPatterns);
        }

    }
}
