package net.csibio.injection.client.domain.query;

import lombok.Data;
import org.springframework.data.domain.Sort;

import java.util.Date;

@Data
public class ProjectQuery extends PageQuery {

    String id;

    String alias;

    String owner;

    Date createDate;

    Date lastModifiedDate;

    String name;

    String userId;

    public ProjectQuery(){}

    public ProjectQuery(int pageNo, int pageSize, Sort.Direction direction, String sortColumn){
        super(pageNo, pageSize, direction, sortColumn);
    }
}
