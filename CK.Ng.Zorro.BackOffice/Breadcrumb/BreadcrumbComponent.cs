using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "breadcrumb-item-show.pipe.ts", "BreadcrumbItemShowPipe" )]
[TypeScriptFile( "breadcrumb.model.ts", "Breadcrumb" )]
[TypeScriptFile( "breadcrumb-item.model.ts", "BreadcrumbItem" )]
public sealed class BreadcrumbComponent : NgComponent
{
}
