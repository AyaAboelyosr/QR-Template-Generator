using Microsoft.AspNetCore.Mvc;
using QR_Templates_Generator.Repository;
using QRGenerator.DTOs.RespnseDTOs;
using QRGenerator.DTOs.ResponseDTOs;

namespace QR_Templates_Generator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplateSelectorController : ControllerBase
    {
        private readonly IQRTemplateRepository _templates;


        public TemplateSelectorController( IQRTemplateRepository Templates)
        {
            _templates = Templates;
        }
        [HttpGet]
        public async Task<IActionResult> GetTemplates()
        {
            var templates = _templates.GetAll();
            if (templates.Any())
            {
                var templateinfo = new List<TemplateInfo>();
                foreach (var template in templates)
                {
                    templateinfo.Add(new TemplateInfo(template));

                }
                return Ok(templateinfo);
            }
            return NotFound();

        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetTemplate(int id)
        {
            var template = _templates.GetById(id);
            if (template == null)
                return NotFound();
            var templateDTO = new QRTemplateReaderDTO(template);
            return Ok(templateDTO);
        }
    }
}
