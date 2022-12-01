package net.csibio.injection.client.domain.bean;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class PlatformConfig implements Serializable {

    @Serial
    private static final long serialVersionUID = -3252329839112756627L;

    /** PlatformName */
    String platform;

    //参数方案ID
    String methodId;
    String methodName;

    //内标库ID
    String insLibId;
    String insLibName;

    //分析库ID
    String anaLibId;
    String anaLibName;

    public PlatformConfig() {}

    public PlatformConfig(String platform) {
        this.platform = platform;
    }

    public PlatformConfig(String platform, String methodId, String methodName, String insLibId, String insLibName, String anaLibId, String anaLibName) {
        this.platform = platform;
        this.methodId = methodId;
        this.methodName = methodName;
        this.insLibId = insLibId;
        this.insLibName = insLibName;
        this.anaLibId = anaLibId;
        this.anaLibName = anaLibName;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (obj instanceof PlatformConfig) {
            PlatformConfig platformConfig = (PlatformConfig) obj;

            return (this.platform.equals(platformConfig.getPlatform()));
        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return platform.hashCode();
    }
}
