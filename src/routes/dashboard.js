import { Router } from 'express';

const router = Router();

// Định nghĩa route cho /dashboard
router.get('/dashboard', (req, res) => {
  const user = req.session.user; // Lấy thông tin người dùng từ session
  const role = user ? user.role : null; // Lấy vai trò từ đối tượng user

  console.log('User:', user); // Kiểm tra thông tin người dùng
  console.log('Role:', role); // Kiểm tra thông tin vai trò

  if (role === 'admin') {
      res.render('dashboard', { title: 'Dashboard', user, role });
  } else if (role === 'employee') {
      res.render('dashboard', { title: 'Dashboard', user, role: 'employee' });
  } 
});

export default router;
