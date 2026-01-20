import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Pencil, Trash2, Image as ImageIcon, X } from 'lucide-react';
import MediaSlider from '../../components/MediaSlider';
import { menuAPI, categoryAPI } from '../../utils/api';

const AdminMenu = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal Form State
    const [mediaItems, setMediaItems] = useState([]);
    const [isActiveStatus, setIsActiveStatus] = useState(true);
    const [selectedLabels, setSelectedLabels] = useState(['Vegetarian']);

    // New Form State
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemDescription, setNewItemDescription] = useState('');
    const [newItemCalories, setNewItemCalories] = useState('250 kcal');
    const [newItemTime, setNewItemTime] = useState('15-20 min');
    const [newItemIsVeg, setNewItemIsVeg] = useState(true);

    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    // Initial Load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsTableLoading(true);
        try {
            const [menuRes, catRes] = await Promise.all([
                menuAPI.getAll(),
                categoryAPI.getAll()
            ]);
            setMenuItems(menuRes.data);
            setCategories(catRes.data);
            if (catRes.data.length > 0) {
                setNewItemCategory(catRes.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsTableLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        const item = menuItems.find(i => i._id === id);
        try {
            await menuAPI.update(id, { isAvailable: !item.isAvailable });
            fetchData();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setNewItemName(item.name);
        setNewItemCategory(item.category?._id || item.category);
        setNewItemPrice(item.price);
        setNewItemDescription(item.description);
        setNewItemCalories(item.calories || '250 kcal');
        setNewItemTime(item.time || '15-20 min');
        setNewItemIsVeg(item.isVeg === undefined ? true : item.isVeg);
        setIsActiveStatus(item.isAvailable);
        setSelectedLabels(item.labels || []);
        setMediaItems(item.media || (item.image ? [{ name: 'Image', url: item.image, type: 'image/jpeg' }] : []));
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await menuAPI.delete(id);
                fetchData();
            } catch (error) {
                alert('Failed to delete item');
            }
        }
    };

    const handleSave = async () => {
        if (!newItemName.trim() || !newItemPrice || !newItemCategory) {
            alert("Please fill in all required fields (Name, Category, Price).");
            return;
        }

        const itemData = {
            name: newItemName,
            category: newItemCategory,
            price: Number(newItemPrice),
            description: newItemDescription,
            calories: newItemCalories,
            time: newItemTime,
            isVeg: newItemIsVeg,
            image: mediaItems.length > 0 ? mediaItems[0].url : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
            isAvailable: isActiveStatus,
            labels: selectedLabels,
            // media: mediaItems // Simplified for now as we don't have file upload handled yet
        };

        try {
            if (editingItem) {
                await menuAPI.update(editingItem._id, itemData);
            } else {
                await menuAPI.create(itemData);
            }
            fetchData();
            setIsModalOpen(false);
            setEditingItem(null);
            resetForm();
        } catch (error) {
            alert('Failed to save item: ' + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setMediaItems([]);
        setIsActiveStatus(true);
        setSelectedLabels([]);
        setNewItemName('');
        setNewItemCategory('Main Course');
        setNewItemPrice('');
        setNewItemDescription('');
        setNewItemCalories('250 kcal');
        setNewItemTime('15-20 min');
        setNewItemIsVeg(true);
    };

    const openModal = () => {
        resetForm();
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
                <button
                    onClick={openModal}
                    className="bg-[#FD6941] hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Menu
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]">
                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-xl font-bold text-gray-800">All Menu</h2>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search menu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#FD6941] transition-all"
                            />
                        </div>
                        <button className="p-3 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
                            {/* Image Container */}
                            <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                                <MediaSlider
                                    media={item.media && item.media.length > 0 ? item.media : [{ url: item.image, type: 'image/jpeg' }]}
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                                    <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-[10px] font-bold text-gray-700 tracking-wide uppercase">{item.isAvailable ? 'Available' : 'Unavailable'}</span>
                                </div>
                                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                                    <div className={`w-3 h-3 border-2 rounded-sm flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-2 px-1 flex-grow">
                                <span className="text-[10px] font-bold text-[#FD6941] tracking-wider uppercase">
                                    {item.category?.name || 'Uncategorized'}
                                </span>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight w-2/3">{item.name}</h3>
                                    <span className="font-bold text-xl text-gray-800">₹{item.price}</span>
                                </div>
                                <div className="flex gap-2 text-[10px] font-bold text-gray-400">
                                    <span>{item.calories}</span>
                                    <span>•</span>
                                    <span>{item.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 h-10">
                                    {item.description}
                                </p>
                            </div>

                            {/* Actions Footer */}
                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={item.isAvailable}
                                            onChange={() => toggleStatus(item._id)}
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${item.isAvailable ? 'bg-[#FD6941]' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${item.isAvailable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </label>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(item)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Item Card */}
                    <div onClick={openModal} className="border-2 border-dashed border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#FD6941] hover:bg-orange-50/10 transition-all min-h-[350px] group bg-gray-50">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-[#FD6941]" />
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-800">Add New Item</h3>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[95vh]">
                        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto no-scrollbar">
                            {/* Media Section */}
                            <div className="lg:col-span-4 bg-gray-50 p-6 border-r border-gray-200">
                                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Item Media</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {mediaItems.map((media, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 group">
                                                <img src={media.url} alt="Media" className="w-full h-full object-cover" />
                                                <button onClick={() => removeMedia(idx)} className="absolute top-1.5 right-1.5 p-1 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        {mediaItems.length < 5 && (
                                            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FD6941] hover:bg-orange-50/10 transition-all">
                                                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    const newMedia = files.map(f => ({ name: f.name, url: URL.createObjectURL(f), type: f.type }));
                                                    setMediaItems([...mediaItems, ...newMedia].slice(0, 5));
                                                }} />
                                                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                                <span className="text-[10px] font-bold text-gray-500">Add Media</span>
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-center">Max 5 images. Recommended 800x600px.</p>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="lg:col-span-8 p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Item Name</label>
                                    <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. Spicy Paneer Tikka" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-1 focus:ring-[#FD6941] outline-none transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Category</label>
                                        <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-1 focus:ring-[#FD6941] outline-none transition-all appearance-none bg-white">
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input type="number" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} placeholder="0.00" className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-1 focus:ring-[#FD6941] outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Calories</label>
                                        <input type="text" value={newItemCalories} onChange={(e) => setNewItemCalories(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-1 focus:ring-[#FD6941] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Prep Time</label>
                                        <input type="text" value={newItemTime} onChange={(e) => setNewItemTime(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-1 focus:ring-[#FD6941] outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Item Type</label>
                                    <div className="flex gap-3">
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${newItemIsVeg ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" checked={newItemIsVeg} onChange={() => setNewItemIsVeg(true)} className="hidden" />
                                            <div className="w-3 h-3 border border-green-600 rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div></div>
                                            <span className="text-xs font-bold">Veg</span>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${!newItemIsVeg ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" checked={!newItemIsVeg} onChange={() => setNewItemIsVeg(false)} className="hidden" />
                                            <div className="w-3 h-3 border border-red-600 rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div></div>
                                            <span className="text-xs font-bold">Non-Veg</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Description</label>
                                    <textarea rows="3" value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-1 focus:ring-[#FD6941] outline-none resize-none" placeholder="Brief description of the item..."></textarea>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Spicy', 'Chef Special'].map(lbl => (
                                        <button key={lbl} onClick={() => toggleLabel(lbl)} className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all ${selectedLabels.includes(lbl) ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                                            {lbl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-bold hover:bg-white transition-all">Cancel</button>
                            <button onClick={handleSave} className="px-8 py-2.5 rounded-full bg-[#FD6941] text-white text-sm font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all">Save Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;
