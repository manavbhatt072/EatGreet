import { useState, useEffect } from 'react';
import { Search, Plus, ListFilter, Trash2, Camera, User, Pizza, Coffee, Utensils, IceCream, Beef, Egg, Wine, Cake, Sandwich, ChevronRight, Pencil, CheckCircle, XCircle } from 'lucide-react';
import { categoryAPI } from '../../utils/api';

const ICON_MAP = {
    Pizza: Pizza,
    Coffee: Coffee,
    Utensils: Utensils,
    IceCream: IceCream,
    Beef: Beef,
    Egg: Egg,
    Wine: Wine,
    Cake: Cake,
    Sandwich: Sandwich,
    ListFilter: ListFilter
};

const iconOptions = Object.keys(ICON_MAP);

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Form state
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Utensils');
    const [status, setStatus] = useState('ACTIVE');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await categoryAPI.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            showNotification('Please enter a category name', 'error');
            return;
        }

        try {
            const categoryData = {
                name,
                icon: selectedIcon
            };

            console.log('Saving category:', categoryData);

            if (editingCategory) {
                const response = await categoryAPI.update(editingCategory._id, categoryData);
                console.log('Update response:', response);
                showNotification('Category updated successfully!', 'success');
            } else {
                const response = await categoryAPI.create(categoryData);
                console.log('Create response:', response);
                showNotification('Category created successfully!', 'success');
            }

            fetchCategories();
            closeModal();
        } catch (error) {
            console.error('Category save error:', error);
            console.error('Error response:', error.response);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save category';
            showNotification(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category? Items in this category will become uncategorized.')) {
            try {
                await categoryAPI.delete(id);
                showNotification('Category deleted successfully!', 'success');
                fetchCategories();
            } catch (error) {
                showNotification('Failed to delete category', 'error');
            }
        }
    };

    const openModal = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setName(cat.name);
            setSelectedIcon(cat.icon || 'Utensils');
        } else {
            setEditingCategory(null);
            setName('');
            setSelectedIcon('Utensils');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-[#FD6941] hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-xl font-bold text-gray-800">All Categories</h2>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#FD6941] transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((cat) => {
                        const IconComponent = ICON_MAP[cat.icon] || Utensils;
                        return (
                            <div key={cat._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-4 rounded-2xl bg-orange-50 text-[#FD6941]">
                                        <IconComponent className="w-8 h-8" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-600">
                                        ACTIVE
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-1">{cat.name}</h3>
                                <p className="text-sm text-gray-500 mb-6">Category for menu items</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(cat)}
                                            className="px-3 py-2 hover:bg-gray-100 rounded-xl text-gray-600 font-bold text-sm transition-colors flex items-center gap-1.5"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                            <p className="text-gray-500 text-sm mt-1">Configure your menu category details</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Category Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none text-gray-800 text-sm font-bold focus:ring-1 focus:ring-[#FD6941] transition-all"
                                    placeholder="e.g. Italian Pizza"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Choose Icon</label>
                                <div className="grid grid-cols-5 gap-3">
                                    {iconOptions.map((iconName) => {
                                        const IconOpt = ICON_MAP[iconName];
                                        return (
                                            <button
                                                key={iconName}
                                                onClick={() => setSelectedIcon(iconName)}
                                                className={`p-3 rounded-2xl border transition-all flex items-center justify-center ${selectedIcon === iconName ? 'border-[#FD6941] bg-orange-50 text-[#FD6941]' : 'border-gray-100 hover:border-gray-200 text-gray-400'
                                                    }`}
                                            >
                                                <IconOpt className="w-6 h-6" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 flex gap-4">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-4 rounded-2xl font-bold bg-[#FD6941] text-white hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all"
                            >
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 fade-in duration-300 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <XCircle className="w-5 h-5" />
                    )}
                    <span className="font-bold text-sm">{notification.message}</span>
                </div>
            )}
        </div>
    );
};

export default AdminCategory;
