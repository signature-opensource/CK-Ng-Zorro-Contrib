using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent( IsOptional = true )]
[Package<ZorroPackage>]
[TypeScriptFile( "breadcrumb-item-model.ts", "BreadcrumbItem" )]
public sealed class BreadcrumbComponent : NgComponent
{
}
