package net.csibio.injection.client.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Data
@Document(collection = "ms_run_config")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MSRunConfigDO implements Serializable {

    @Id
    String id;

}
