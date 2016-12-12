package ca.uhn.fhir.util.jar;

import ca.uhn.fhir.util.CoverageIgnore;
import ca.uhn.fhir.util.ReflectionUtil;

/*
 * #%L
 * HAPI FHIR - Core Library
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

public class DependencyLogFactory {
	
	/**
	 * Non instantiable
	 */
	@CoverageIgnore
	private DependencyLogFactory() {
		// nothing
	}
	
	public static IDependencyLog createJarLogger() {
		return ReflectionUtil.newInstanceOrReturnNull("ca.uhn.fhir.util.jar.DependencyLogImpl", IDependencyLog.class);
	}
}