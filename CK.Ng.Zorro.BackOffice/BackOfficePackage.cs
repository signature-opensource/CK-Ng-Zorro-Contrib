using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[TypeScriptPackage]
[TypeScriptImportLibrary( "@angular/cdk", "^19", DependencyKind.Dependency, ForceUse = true )]
[NgProviderImport( "provideAnimationsAsync", LibraryName = "@angular/platform-browser/animations/async" )]
[NgProvider( "provideAnimationsAsync()" )]
[Requires<CK.Ng.Zorro.TSPackage>]
public class BackOfficePackage : TypeScriptPackage
{
}
