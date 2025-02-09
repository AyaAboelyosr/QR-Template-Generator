using System.ComponentModel.DataAnnotations;

namespace SimplyFairDMS.DTOs.RequestDTOs
{
    // Main submission DTO that matches the form structure
    public class QRRecordSubmissionDto
    {
        public long? RecordId { get; set; }
        public long TemplateId { get; set; }
        
        public List<QRFieldValueDto> Fields { get; set; }
    }

    // DTO for individual field values
    public class QRFieldValueDto
    {
       
        public long SectionId { get; set; }

        
        public long FieldId { get; set; }

        public string Value { get; set; }
        public Guid? RowIndex { get; set; }
    }

    // DTO for the created record response
    public class QRRecordResponseDto
    {
        public long RecordId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public List<QRRecordValueDto> Values { get; set; }
    }

    // DTO for individual values in the response
    public class QRRecordValueDto
    {
        public long FieldId { get; set; }
        public string? FieldTitle { get; set; }
        public string Value { get; set; }
    }
}
