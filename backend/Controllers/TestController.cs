using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        [HttpGet("protected")]
        [Authorize]
        public IActionResult GetProtected()
        {
            return Ok(new { Message = "Du har tillgång, grymt jobbat!" });
        }

        [HttpGet("public")]
        public IActionResult GetPublic()
        {
            return Ok(new { Message = "Det här är en öppen endpoint." });
        }
    }
}
