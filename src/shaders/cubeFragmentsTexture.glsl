uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
void main()
{
    vec4 textureChange = texture2D(uTexture, vUv);
    gl_FragColor = textureChange;
}