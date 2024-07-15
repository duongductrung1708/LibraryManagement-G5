import { FiBookOpen, FiCheckCircle, FiHome, FiList, FiLock, FiUsers, FiFile, FiDollarSign } from 'react-icons/fi';

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <FiHome />,
  },
  {
    title: 'Books',
    path: '/books',
    icon: <FiBookOpen />,
  },
  {
    title: 'Authors',
    path: '/authors',
    icon: <FiUsers />,
  },
  {
    title: 'Genres',
    path: '/genres',
    icon: <FiList />,
  },
  {
    title: 'Borrowals',
    path: '/borrowals',
    icon: <FiCheckCircle />,
  },
  {
    title: 'Fines',
    path: '/manage-fines',
    icon: <FiDollarSign />,
  },
  {
    title: 'Users',
    path: '/users',
    icon: <FiLock />,
  },
  {
    title: 'Rules',
    path: '/rules',
    icon: <FiFile />,
  },
];

export default navConfig;
