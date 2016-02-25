package ca.uhn.fhir.jpa.entity;

/*
 * #%L
 * HAPI FHIR JPA Server
 * %%
 * Copyright (C) 2014 - 2016 University Health Network
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

//@formatter:off
@Table(name="TRM_CODESYSTEM", uniqueConstraints= {
	@UniqueConstraint(name="IDX_CS_RESOURCEPID", columnNames= {"RES_ID"})
})
@Entity()
//@formatter:on
public class TermCodeSystem implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id()
	@SequenceGenerator(name="SEQ_CODESYSTEM_PID", sequenceName="SEQ_CODESYSTEM_PID")
	@GeneratedValue()
	@Column(name="PID")
	private Long myPid;
	
	@OneToOne()
	@JoinColumn(name="RES_ID", referencedColumnName="RES_ID", nullable=false, updatable=false)
	private ResourceTable myResource;
	
	@Column(name="RES_VERSION_ID", nullable=false, updatable=false)
	private Long myResourceVersionId;

}