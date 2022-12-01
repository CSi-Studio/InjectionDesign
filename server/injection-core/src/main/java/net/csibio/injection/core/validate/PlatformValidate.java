package net.csibio.injection.core.validate;

import net.csibio.injection.client.domain.vo.platform.PlatformAddVO;
import org.springframework.stereotype.Service;

@Service
public class PlatformValidate {

    public Boolean checkPlatformAdd(PlatformAddVO platformAddVO) {
        return true;
    }

}
