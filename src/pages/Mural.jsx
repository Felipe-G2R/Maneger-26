import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, Image as ImageIcon, Loader2, ArrowRight, Camera } from 'lucide-react'
import { Card, Modal } from '../components/common'
import { useMuralStore } from '../store/useMuralStore'

export function Mural() {
    const { items, currentPhoto, goalPhoto, fetchItems, addItem, deleteItem, loading } = useMuralStore()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState('progress') // 'current', 'goal', 'progress'

    const [selectedFile, setSelectedFile] = useState(null)
    const [caption, setCaption] = useState('')
    const [previewUrl, setPreviewUrl] = useState(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    const openModal = (type) => {
        setModalType(type)
        setIsModalOpen(true)
    }

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleCreate = async () => {
        if (!selectedFile) return

        await addItem(selectedFile, caption, modalType)

        handleCloseModal()
    }

    const handleCloseModal = () => {
        setSelectedFile(null)
        setCaption('')
        setPreviewUrl(null)
        setIsModalOpen(false)
    }

    const ReferenceCard = ({ title, photo, type, placeholderIcon: Icon }) => (
        <div className="relative group">
            <div
                onClick={() => openModal(type)}
                className={`
          aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
          ${photo
                        ? 'border-transparent bg-slate-900'
                        : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }
        `}
            >
                {photo ? (
                    <>
                        <img src={photo.image_url} alt={title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-bold mb-2">Alterar Foto</p>
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6">
                        <Icon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="font-medium text-slate-700 dark:text-slate-200">
                            Adicionar {title}
                        </p>
                    </div>
                )}
            </div>
            <h3 className="text-center mt-3 font-bold text-lg">{title}</h3>
            {photo?.caption && (
                <p className="text-center text-sm text-slate-500 mt-1">{photo.caption}</p>
            )}
        </div>
    )

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Minha Transformacao</h1>
                <p className="text-slate-500 dark:text-dark-muted mt-1">
                    Visualize seu estado atual e onde voce quer chegar
                </p>
            </div>

            {loading && !currentPhoto && !goalPhoto && items.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : (
                <>
                    {/* Reference Cards (Current vs Goal) */}
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center max-w-4xl mx-auto">
                        <div className="w-full max-w-sm">
                            <ReferenceCard
                                title="Versao Atual"
                                photo={currentPhoto}
                                type="current"
                                placeholderIcon={ImageIcon}
                            />
                        </div>

                        <div className="hidden md:flex items-center justify-center text-slate-300 dark:text-slate-600">
                            <ArrowRight className="w-12 h-12" />
                        </div>

                        <div className="w-full max-w-sm">
                            <ReferenceCard
                                title="Meu Objetivo"
                                photo={goalPhoto}
                                type="goal"
                                placeholderIcon={Loader2} // Usando Loader2 como icone placeholder temporario ou outro disponivel
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-dark-border my-8" />

                    {/* Weekly Progress Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Camera className="w-6 h-6 text-primary-500" />
                                Evolucao Semanal
                            </h2>
                            <button
                                onClick={() => openModal('progress')}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Nova Foto
                            </button>
                        </div>

                        {items.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {items.map((item) => (
                                    <div key={item.id} className="group relative">
                                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-md transition-all">
                                            <img
                                                src={item.image_url}
                                                alt={item.caption || 'Progresso'}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Actions */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => deleteItem(item.id, item.image_url)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                            {item.caption && (
                                                <p className="text-sm font-medium truncate" title={item.caption}>
                                                    {item.caption}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center py-12">
                                <Camera className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                                <h3 className="text-lg font-medium mb-2">Sem registros ainda</h3>
                                <p className="text-slate-500 dark:text-dark-muted">
                                    Tire uma foto toda semana para acompanhar sua evolucao.
                                </p>
                            </Card>
                        )}
                    </div>
                </>
            )}

            {/* Upload Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={
                    modalType === 'current' ? 'Definir Versao Atual' :
                        modalType === 'goal' ? 'Definir Objetivo' :
                            'Adicionar Registro Semanal'
                }
            >
                <div className="space-y-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`
              relative aspect-[3/4] max-h-[400px] mx-auto rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden
              ${previewUrl
                                ? 'border-primary-500 bg-slate-900'
                                : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }
            `}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center p-6">
                                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                <p className="font-medium text-slate-700 dark:text-slate-200">
                                    Selecionar Foto
                                </p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    <div>
                        <label className="label">Legenda (Opcional)</label>
                        <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder={modalType === 'goal' ? "Ex: Corpo definido com 80kg" : "Ex: Semana 1 - Inicio"}
                            className="input"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleCloseModal}
                            className="btn btn-secondary flex-1"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!selectedFile || loading}
                            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
