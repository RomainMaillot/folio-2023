void main()	{
	gl_Position = projectionMatrix
	  * modelViewMatrix
	  * vec4(position.x, position.y, position.z, 1.0);
	// gl_Position = projectionMatrix
	//   * modelViewMatrix
	//   * vec4(position.x, sin(position.z), position.z, 1.0);
	// gl_Position = projectionMatrix
	//   * modelViewMatrix
	//   * vec4(position.x, sin(position.z) + position.y, position.z, 1.0);
	// gl_Position = projectionMatrix
	//   * modelViewMatrix
	//   * vec4(position.x, sin(position.z/4.0) + position.y, position.z, 1.0);
	// gl_Position = projectionMatrix
	// 	* modelViewMatrix
	// 	* vec4(position.x, 4.0*sin(position.z/4.0) + position.y, position.z, 1.0);
}
