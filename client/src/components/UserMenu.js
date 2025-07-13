import React, { useRef, useEffect, useState } from 'react';
import './UserMenu.css';
import { FaUserCircle } from 'react-icons/fa';
import { FiEdit, FiLogOut } from 'react-icons/fi';
import axios from 'axios';

const UserMenu = ({ user, onLogout, updateUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');

  const modalRef = useRef();

  const handleUpdate = async () => {
    try {
      const res = await axios.put('/api/auth/update-profile', {
        email: user.email,
        name,
        password,
      });
      updateUser(res.data.user);
      setShowModal(false);
      alert('Profile updated!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  return (
    <div className="user-menu">
      <FaUserCircle className="profile-icon" onClick={() => setShowModal(true)} />

      {showModal && (
        <div className="modal-overlay">
          <div className="profile-modal" ref={modalRef}>
            <h3>Update Profile</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (optional)"
            />
            <div className="buttons">
              <button onClick={handleUpdate}><FiEdit /> Update</button>
              <button className="logout" onClick={onLogout}><FiLogOut /> Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
