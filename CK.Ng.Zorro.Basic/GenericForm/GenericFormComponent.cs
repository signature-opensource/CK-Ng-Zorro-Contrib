using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent( IsOptional = true )]
[Package<ZorroPackage>]
[TypeScriptFile( "generic-form-model.ts", "GenericFormData", "IFormControlConfig", "FormControlConfig", "FormControlType" )]
[TypeScriptFile( "generic-form-fields.ts", "FieldType", "FieldOption", "CustomFieldContext", "GenericField", "GenericFields", "ModelOf", "FieldOpts", "GenericFormHandle",
                 "textField", "passwordField", "numberField", "dateField", "checkboxField", "selectField", "customField", "genericForm" )]
public sealed class GenericFormComponent : NgComponent
{
}
