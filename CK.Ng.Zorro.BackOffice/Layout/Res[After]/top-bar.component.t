create <ts> transformer
begin
    ensure import { UserInfoBoxComponent } from '@local/ck-gen';

    in after "@Component" 
        in first {^braces}
            in after "imports:"
                in first {^[]}
                    replace "CommonModule" with "CommonModule, UserInfoBoxComponent";
end
