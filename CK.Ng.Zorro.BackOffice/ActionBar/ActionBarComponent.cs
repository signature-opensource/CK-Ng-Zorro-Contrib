using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "models/action-bar.model.ts", "ActionBarContent", "Action" )]
public sealed class ActionBarComponent : NgComponent
{
}
