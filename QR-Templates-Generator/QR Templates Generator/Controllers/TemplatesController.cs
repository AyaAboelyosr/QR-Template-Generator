using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QR_Templates_Generator.DTOs;
using QR_Templates_Generator.Models;
using QR_Templates_Generator.Repository;
using QR_Templates_Generator.Utilities;
using QR_Templates_Generator.Validations;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace QR_Templates_Generator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = UserRoles.Admin)]
    public class QRTemplateController : ControllerBase
    {
        private readonly IQRTemplateRepository genericRepository;
        private readonly IGenericRepository<QRTemplateSection> genericSectionRepository;
        private readonly IQRTemplateSectionFieldRepository genericFieldRepository;

        private readonly IMapper mapper;


        public QRTemplateController(IQRTemplateRepository genericRepository, IGenericRepository<QRTemplateSection> genericSectionRepository, IQRTemplateSectionFieldRepository genericFieldRepository, IMapper mapper)
        {

            this.genericRepository = genericRepository;
            this.genericSectionRepository = genericSectionRepository;
            this.genericFieldRepository = genericFieldRepository;
            this.mapper = mapper;

        }


        [HttpGet]
        public ActionResult<IEnumerable<QRTemplateeDTO>> GetAll()
        {
            var templates = genericRepository.GetAll();
            var result = mapper.Map<IEnumerable<QRTemplateeDTO>>(templates);

            return Ok(result);


        }
        [HttpGet("{id}")]
        public ActionResult<QRTemplateDTO> GetById(long id)
        {
            var template = genericRepository.GetByIdWithSections(id);
            if (template == null)
                return NotFound(new { message = "Template not found" });



            var result = mapper.Map<QRTemplateDTO>(template);
            return Ok(result);

        }

        [HttpPost]
        public ActionResult Create(AddQRTemplateDTO addQRTemplateDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var template = mapper.Map<QRTemplate>(addQRTemplateDTO);

            genericRepository.Insert(template);
            genericRepository.Save();

            var response = mapper.Map<ResponseQRTemplateDTO>(template);

            return CreatedAtAction(nameof(GetById), new { id = template.ID }, response);
        }


        [HttpPut("{id}")]
        public ActionResult Update(long id, UpdateQRTemplateDTO updateQRTemplateDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTemplate = genericRepository.GetById(id);
            if (existingTemplate == null)
            {
                return NotFound(new { message = "Template not found" });
            }


            mapper.Map(updateQRTemplateDTO, existingTemplate);


            if (!string.IsNullOrEmpty(updateQRTemplateDTO.UniqeCode) && updateQRTemplateDTO.UniqeCode != existingTemplate.UniqeCode)
            {
                var uniqueCodeValidation = new UniqueAttribute();
                var validationResult = uniqueCodeValidation.GetValidationResult(updateQRTemplateDTO.UniqeCode, new ValidationContext(updateQRTemplateDTO));

                if (validationResult != ValidationResult.Success)
                {
                    return BadRequest(new { message = validationResult.ErrorMessage });
                }

                existingTemplate.UniqeCode = updateQRTemplateDTO.UniqeCode;
            }

            genericRepository.Update(existingTemplate);
            genericRepository.Save();

            var response = mapper.Map<ResponseQRTemplateDTO>(existingTemplate);

            return Ok(response);
        }


        [HttpDelete("{id}")]
        public ActionResult Delete(long id)
        {

            var template = genericRepository.GetById(id);
            if (template == null)
            {
                return NotFound(new { message = "Template not found" });
            }


            var hasSections = genericSectionRepository.GetAll().Any(s => s.QRTemplateID == id);

            if (hasSections)
            {
                return BadRequest(new { message = "Template cannot be deleted because it contains sections." });
            }


            genericRepository.Delete(id);
            genericRepository.Save();

            return Ok(new { message = "Template deleted successfully" });
        }



        [HttpPost("{templateId}/sections")]
        public ActionResult AddSection(long templateId, AddSectionDTO addSectionDTO)
        {
            var template = genericRepository.GetAll().Any(t => t.ID == templateId);
            if (template == null)
            {
                return NotFound(new { message = "Template not found" });
            }

            var section = mapper.Map<QRTemplateSection>(addSectionDTO);
            section.QRTemplateID = templateId;

            genericSectionRepository.Insert(section);
            genericSectionRepository.Save();


            var response = mapper.Map<ResponseSectionDTO>(section);

            return Ok(response);
        }

        [HttpPut("{templateId}/sections/{sectionId}")]
        public ActionResult UpdateSection(long templateId, long sectionId, UpdateSectionDTO updateSectionDTO)
        {
           
            var section = genericSectionRepository.GetById(sectionId);
            if (section == null || section.QRTemplateID != templateId)
            {
                return NotFound(new { message = "Template or Section not found" });
            }


            mapper.Map(updateSectionDTO, section);


            genericSectionRepository.Update(section);
            genericSectionRepository.Save();


            var response = mapper.Map<ResponseSectionDTO>(section);

            return Ok(response);
        }


        [HttpDelete("{templateId}/sections/{sectionId}")]
        public ActionResult DeleteSection(long templateId, long sectionId)
        {

            var section = genericSectionRepository.GetById(sectionId);


            if (section == null || section.QRTemplateID != templateId)
            {
                return NotFound(new { message = "Template or Section not found" });
            }


            genericSectionRepository.Delete(section);
            genericSectionRepository.Save();

            return Ok(new { message = "Section deleted successfully" });
        }



        [HttpGet("{templateId}/sections/{sectionId}/fields")]
        public ActionResult<IEnumerable<ResponseFieldDTO>> GetAllFields(long templateId, long sectionId)
        {
            var sectionExists = genericSectionRepository.GetAll().Any(s => s.ID == sectionId && s.QRTemplateID == templateId);
            if (!sectionExists)
            {
                return NotFound(new { message = "Section not found or does not belong to the specified template" });
            }

            var fields = genericFieldRepository.GetAll().Where(f => f.QRTemplateSectionID == sectionId);
            var result = mapper.Map<IEnumerable<ResponseFieldDTO>>(fields);
            return Ok(result);
        }


        [HttpPost("{templateId}/sections/{sectionId}/fields")]
        public ActionResult AddField(long templateId, long sectionId, AddFieldDTO addFieldDTO)
        {

            var sectionExists = genericSectionRepository.GetAll().Any(s => s.ID == sectionId && s.QRTemplateID == templateId);

            if (!sectionExists)
            {
                return NotFound(new { message = "Section not found or does not belong to the specified template" });
            }

           
            var field = mapper.Map<QRTemplateSectionField>(addFieldDTO);

          
            field.QRTemplateSectionID = sectionId;

          
            genericFieldRepository.Insert(field);
            genericFieldRepository.Save();

         
            var response = mapper.Map<ResponseFieldDTO>(field);

            return Ok(response);
        }


        [HttpPut("{templateId}/sections/{sectionId}/fields/{fieldId}")]
        public ActionResult UpdateField(long templateId, long sectionId, long fieldId, UpdateFieldDTO updateFieldDTO)
        {
            var field = genericFieldRepository.GetFieldById(fieldId, sectionId);
            if (field == null)
            {
                return NotFound(new { message = "Field not found" });
            }

         
            mapper.Map(updateFieldDTO, field);

            genericFieldRepository.Update(field);
            genericFieldRepository.Save();

          
            var response = mapper.Map<ResponseFieldDTO>(field);

            return Ok(response);
        }


        [HttpDelete("{templateId}/sections/{sectionId}/fields/{fieldId}")]
        public ActionResult DeleteField(long templateId, long sectionId, long fieldId)
        {
           
            var field = genericFieldRepository.GetFieldById(fieldId, sectionId);
            if (field == null)
            {
                return NotFound(new { message = "Field not found" });
            }

         
            genericFieldRepository.Delete(field);
            genericFieldRepository.Save();

            return Ok(new { message = "Field deleted successfully" });
        }


    }




}
