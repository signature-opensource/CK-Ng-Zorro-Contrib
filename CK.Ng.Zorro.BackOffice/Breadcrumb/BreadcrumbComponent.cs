using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "breadcrumb-item-show.pipe.ts", "BreadcrumbItemShowPipe" )]
[TypeScriptFile( "models/breadcrumb.model.ts", "Breadcrumb" )]
[TypeScriptFile( "models/breadcrumb-item.model.ts", "BreadcrumbItem" )]
public sealed class BreadcrumbComponent : NgComponent
{
}
