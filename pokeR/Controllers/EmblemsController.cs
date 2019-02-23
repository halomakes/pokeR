using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokeR.Models.Entities;
using PokeR.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PokeR.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmblemsController : ControllerBase
    {
        private readonly RoomContext _context;

        public EmblemsController(RoomContext context)
        {
            _context = context;
        }

        // GET: api/Emblems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Emblem>>> GetEmblem()
        {
            return await _context.Emblems.ToListAsync();
        }

        // GET: api/Emblems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Emblem>> GetEmblem(int id)
        {
            var emblem = await _context.Emblems.FindAsync(id);

            if (emblem == null)
            {
                return NotFound();
            }

            return emblem;
        }

        [HttpGet("{id}/image")]
        public async Task<ActionResult> GetEmblemImage(int id)
        {
            var emblem = await _context.Emblems.FindAsync(id);

            if (emblem == null)
            {
                return NotFound();
            }

            return Redirect(emblem.ImageUrl);
        }

        // PUT: api/Emblems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmblem(int id, Emblem emblem)
        {
            if (id != emblem.Id)
            {
                return BadRequest();
            }

            _context.Entry(emblem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmblemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Emblems
        [HttpPost]
        public async Task<ActionResult<Emblem>> PostEmblem(Emblem emblem)
        {
            _context.Emblems.Add(emblem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmblem", new { id = emblem.Id }, emblem);
        }

        // DELETE: api/Emblems/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Emblem>> DeleteEmblem(int id)
        {
            var emblem = await _context.Emblems.FindAsync(id);
            if (emblem == null)
            {
                return NotFound();
            }

            _context.Emblems.Remove(emblem);
            await _context.SaveChangesAsync();

            return emblem;
        }

        private bool EmblemExists(int id)
        {
            return _context.Emblems.Any(e => e.Id == id);
        }
    }
}
