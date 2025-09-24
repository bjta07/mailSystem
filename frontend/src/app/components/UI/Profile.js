'use client'
import { useState } from 'react';
import { useAuth } from '@/config/contexts/AuthContext';
import styles from '@/styles/Profile.module.css';
import { authApi } from '@/config/api/apiAuth';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        phone: user?.phone || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await authApi.updateProfile(user.uid, {
                username: profileData.username,
                phone: profileData.phone,
                email: user.email, // mantenemos el email actual
                ci: user.ci, // mantenemos el CI actual
                name: user.name
            });

            if (response && response.ok) {
                updateUser(response.data);
                setSuccess('Perfil actualizado correctamente');
                setIsEditing(false);
            }
        } catch (err) {
            setError(err.message || 'Error al actualizar el perfil');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Las contraseñas nuevas no coinciden');
            return;
        }

        try {
            const response = await authApi.updatePassword(user.uid, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response && response.ok) {
                setSuccess('Contraseña actualizada correctamente');
                setIsChangingPassword(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (err) {
            setError(err.message || 'Error al actualizar la contraseña');
        }
    };

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.title}>Mi Perfil</h2>
            
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.infoSection}>
                <div className={styles.field}>
                    <label>Nombre</label>
                    <span>{user?.name}</span>
                </div>
                <div className={styles.field}>
                    <label>Email:</label>
                    <span>{user?.email}</span>
                </div>
                <div className={styles.field}>
                    <label>CI:</label>
                    <span>{user?.ci}</span>
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleProfileSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Nombre de usuario:</label>
                        <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Teléfono:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className={styles.cancelButton}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                >
                    Editar Perfil
                </button>
            )}

            <div className={styles.passwordSection}>
                {isChangingPassword ? (
                    <form onSubmit={handlePasswordSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Contraseña Actual:</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nueva Contraseña:</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirmar Nueva Contraseña:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button type="submit" className={styles.saveButton}>
                                Cambiar Contraseña
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                }}
                                className={styles.cancelButton}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsChangingPassword(true)}
                        className={styles.passwordButton}
                    >
                        Cambiar Contraseña
                    </button>
                )}
            </div>
        </div>
    );
}
