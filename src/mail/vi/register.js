const register = ({ urlVerify }) => {
  return `
    <h1> Vui lòng xác nhận địa chỉ Email</h1>
    <a href="${urlVerify}" target="_blank">Nhấn vào đây để kích hoạt tài khoản.</a> 
    `;
};
export default register;
