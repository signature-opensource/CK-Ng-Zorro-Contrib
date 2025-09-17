create <ts> transformer
begin
    ensure import { UserInfoBox } from '@local/ck-gen';

    in after "@Component" 
        in first {^braces}
            in after "imports:"
                in first {^[]}
                    replace "CommonModule" with "CommonModule, UserInfoBox";
end
