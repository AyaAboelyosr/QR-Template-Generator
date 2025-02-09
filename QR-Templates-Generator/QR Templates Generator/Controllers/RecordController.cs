using Microsoft.AspNetCore.Mvc;
using QR_Templates_Generator.Models;
using QR_Templates_Generator.Repository;
using QRGenerator.DTOs.RequestDTOs;
using SimplyFairDMS.DTOs.RequestDTOs;
using static SimplyFairDMS.Utilities.TypeEnums;

namespace QR_Templates_Generator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecordController : ControllerBase
    {
        private readonly IQRRecordRepository _records;

        public RecordController( IQRRecordRepository Records )
        {
            _records = Records;
        }

        [HttpGet]
        public async Task<IActionResult> GetRecords()
        {
            var records = await _records.GetAllAsync();
            var recordDTOS = new List<RecordListDTO>();
            if (records.Any())
            {
                foreach (var record in records)
                {
                    recordDTOS.Add(new RecordListDTO(record));
                }
                return Ok(recordDTOS);
            }


            return NoContent();
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecord(int id)
        {
            var record = await _records.GetByIdAsync(id);
            if (record == null)
            {
                return NotFound();
            }
            var recordDTO = new RecordPreviewDTO(record);
            return Ok(recordDTO);
        }

        [HttpPost]
        public async Task<IActionResult> AddRecord([FromBody] QRRecordSubmissionDto record)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            // Create the main record
            var result = await CreateRecordAsync(record);
            return Ok();
        }
        [HttpPut]

        public async Task<IActionResult> UpdateRecord([FromBody] QRRecordSubmissionDto newRecord)
        {
            var record = await _records.GetByIdAsync(newRecord.RecordId);
            if (record == null)
                return NotFound();
            var result = await UpdateRecordAsync(newRecord, record);
            return Ok();

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecord(int id)
        {
            var record = await _records.GetByIdAsync(id);
            if (record == null)
                return NotFound();
            _records.Delete(record);
            _records.Save();
            return Ok();
        }
        private async Task<bool> UpdateRecordAsync(QRRecordSubmissionDto submission, QRRecord oldrecord)
        {

            // Update template ID
            oldrecord.QRTemplateID = submission.TemplateId;

            // Clear existing values
            oldrecord.Values.Clear();

            // Group fields by SectionId
            var groupedFields = submission.Fields.GroupBy(f => f.SectionId);

            foreach (var sectionGroup in groupedFields)
            {
                var sectionId = sectionGroup.Key;

                // Check if the section is a table section
                var isTableSection = oldrecord.QRTemplate.QRTemplateSections
                    .FirstOrDefault(s => s.ID == sectionId)?.SectionType == QRTemplateSectionType.Table;

                if (isTableSection)
                {
                    // Group table fields by RowIndex
                    var rowGroups = sectionGroup.GroupBy(f => f.RowIndex);
                    foreach (var row in rowGroups)
                    {
                        var rowId = row.Key ?? Guid.NewGuid(); // Use existing rowIndex or generate a new one

                        foreach (var fieldValue in row)
                        {
                            if (!string.IsNullOrEmpty(fieldValue.Value))
                            {
                                oldrecord.Values.Add(new QRRecordSectionFieldValue
                                {
                                    QRTemplateSectionID = fieldValue.SectionId,
                                    QRTemplateSectionFieldID = fieldValue.FieldId,
                                    Value = fieldValue.Value,
                                    RowIndex = rowId // Use rowIndex for grouping
                                });
                            }
                        }
                    }
                }
                else
                {
                    // Handle regular form sections
                    foreach (var fieldValue in sectionGroup)
                    {
                        if (!string.IsNullOrEmpty(fieldValue.Value))
                        {
                            oldrecord.Values.Add(new QRRecordSectionFieldValue
                            {
                                QRTemplateSectionID = fieldValue.SectionId,
                                QRTemplateSectionFieldID = fieldValue.FieldId,
                                Value = fieldValue.Value
                            });
                        }
                    }
                }
            }


            _records.Update(oldrecord);
            await _records.SaveAsync();
            return true;
        }
        private async Task<bool> CreateRecordAsync(QRRecordSubmissionDto submission)
        {

            var record = new QRRecord
            {
                QRTemplateID = submission.TemplateId,
                Values = new List<QRRecordSectionFieldValue>()
            };

            // Group fields by SectionId and RowId
            var groupedFields = submission.Fields
                .GroupBy(f => new { f.SectionId, f.RowIndex })
                .ToList();

            foreach (var group in groupedFields)
            {
                var sectionId = group.Key.SectionId;
                var rowId = group.Key.RowIndex ?? Guid.NewGuid(); // Use the existing rowId or generate a new one

                foreach (var fieldValue in group)
                {
                    if (!string.IsNullOrEmpty(fieldValue.Value))
                    {
                        record.Values.Add(new QRRecordSectionFieldValue
                        {
                            QRTemplateSectionID = sectionId,
                            QRTemplateSectionFieldID = fieldValue.FieldId,
                            Value = fieldValue.Value,
                            RowIndex = rowId // Associate the rowIndex with the field
                        });
                    }
                }
            }

            _records.Insert(record);
            var result = await _records.SaveAsync();
            if(result!=0)
            return true;
            return false;
        }

        private QRRecordResponseDto CreateResponseDto(QRRecord record)
        {

            return new QRRecordResponseDto
            {
                RecordId = record.ID,
                Values = record.Values.Select(v => new QRRecordValueDto
                {
                    FieldId = v.QRTemplateSectionFieldID ?? 0,
                    FieldTitle = v.QRTemplateSectionField.FieldTitle?? "",
                    Value = v.Value ?? string.Empty
                }).ToList()
            };
        }
    }
}

