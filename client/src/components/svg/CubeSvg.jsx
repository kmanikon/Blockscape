const CubeSvg = ({ cubeColor }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    {/* Top side of the cube */}
    <path
      d="M12 4.095L18.538 7 12 9.905l-1.308-.581L5.463 7 12 4.095z"
      fill={cubeColor}
    />
    {/* Front side of the cube */}
    <path
      d="M21.406 6.086l-9-4a1.001 1.001 0 0 0-.813 0l-9 4c-.02.009-.034.024-.054.035-.028.014-.058.023-.084.04-.022.015-.039.034-.06.05a.87.87 0 0 0-.19.194c-.02.028-.041.053-.059.081a1.119 1.119 0 0 0-.076.165c-.009.027-.023.052-.031.079A1.013 1.013 0 0 0 2 7v10c0 .396.232.753.594.914l9 4c.13.058.268.086.406.086a.997.997 0 0 0 .402-.096l.004.01 9-4A.999.999 0 0 0 22 17V7a.999.999 0 0 0-.594-.914z"
      fill={cubeColor}
    />
    {/* Right side of the cube */}
    <path
      d="M4 16.351V8.539l7 3.111v7.811l-7-3.11zm9 3.11V11.65l7-3.111v7.812l-7 3.11z"
      fill={cubeColor}
    />
    {/* Edge lines separating top, front, and right sides */}


    
    <path
        d="M12 9.905M12 9.905L5.463 7M12 9.905L18.538 7M12 9.905V19.461"
        fill="none"
        stroke="black"
        strokeWidth="0.1"
    />
  </svg>
);

export default CubeSvg;