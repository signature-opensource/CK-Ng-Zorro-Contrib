using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "models/generic-form-control.model.ts", "GenericFormData, IFormControlConfig, FormControlConfig, FormControlType" )]
public sealed class GenericFormComponent : NgComponent
{
}
