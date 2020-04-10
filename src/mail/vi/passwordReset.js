const passwordReset = ({ urlReset }) => {
  return `
    <h1> Vui lòng nhấp vào link bên dưới để đặt lại mật khẩu</h1>
    <a href="${urlReset}" target="_blank">Nhấn vào đây để đặt lại mật khẩu.</a> 
    `;
};
export default passwordReset;
