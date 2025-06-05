// import React, { useState } from 'react'
// import { useMutation } from '@apollo/client'
// import { gql } from '@apollo/client'
// import { z } from 'zod'

// // Form validation schema
// const formSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   language: z.string().min(1, "Language is required"),
//   genre: z.string().min(1, "Genre is required"),
//   secondaryGenre: z.string().optional(),
//   songs: z.array(z.instanceof(File)).min(1, "At least one song is required"),
//   art: z.instanceof(File).optional(),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   features: z.string().optional(),
//   releaseType: z.string().min(1, "Release type is required"),
//   version: z.string().optional(),
//   Roles: z
//     .array(
//       z.object({
//         artistRole: z.string().min(1, "Artist role is required"),
//         artistRoleName: z.string().min(1, "Artist name is required"),
//       }),
//     )
//     .min(1, "At least one artist role is required"),
//   lable: z.string().optional(),
//   referenceNo: z.string().optional(),
//   upc: z.string().optional(),
//   releaseDate: z.date({
//     required_error: "Release date is required",
//   }),
//   digitalReleaseDate: z.date({
//     required_error: "Digital release date is required",
//   }),
//   licenseType: z.string().min(1, "License type is required"),
//   legalOwner: z.object({
//     legalOwnerName: z.string().min(1, "Legal owner name is required"),
//     legalOwnerYear: z.string().min(4, "Valid year is required"),
//   }),
//   legalOwnerRelease: z.object({
//     legalOwnerReleaseName: z
//       .string()
//       .min(1, "Legal owner release name is required"),
//     legalOwnerReleaseYear: z.string().min(4, "Valid year is required"),
//   }),
//   publishingRegions: z.string().min(1, "Publishing regions are required"),
//   budget: z.string().min(1, "Budget is required"),
//   distributionPlatform: z
//     .array(z.string())
//     .min(1, "At least one distribution platform is required"),
// })

// type FormSchema = z.infer<typeof formSchema>

// // GraphQL Mutation
// const CREATE_RELEASE = gql`
//   mutation CreateRelease($input: CreateReleaseInput!) {
//     createRelease(input: $input) {
//       id
//       title
//       language
//       genre
//       artworkUrl
//       songs {
//         id
//         title
//         fileUrl
//       }
//       artistRoles {
//         id
//         artistRole
//         artistRoleName
//       }
//     }
//   }
// `

// interface FileUploadResult {
//   type: string
//   url: string
//   key: string
// }

// export default function ReleaseForm() {
//   const [formData, setFormData] = useState<Partial<FormSchema>>({
//     Roles: [{ artistRole: '', artistRoleName: '' }],
//     distributionPlatform: [],
//     legalOwner: { legalOwnerName: '', legalOwnerYear: '' },
//     legalOwnerRelease: { legalOwnerReleaseName: '', legalOwnerReleaseYear: '' },
//   })

//   const [files, setFiles] = useState<{
//     songs: File[]
//     art?: File
//   }>({ songs: [] })

//   const [isUploading, setIsUploading] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

//   const [createRelease, { loading }] = useMutation(CREATE_RELEASE)

//   // Available options
//   const releaseTypes = ['Album', 'EP', 'Single', 'Compilation']
//   const licenseTypes = ['Exclusive', 'Non-Exclusive', 'Work for Hire']
//   const platforms = ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Deezer', 'Tidal']

//   const handleInputChange = (field: string, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }))
//     }
//   }

//   const handleNestedInputChange = (parent: string, field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [parent]: { ...prev[parent as keyof typeof prev], [field]: value }
//     }))
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, files: fileList } = e.target
//     if (!fileList) return

//     if (name === 'songs') {
//       setFiles(prev => ({ ...prev, songs: Array.from(fileList) }))
//     } else if (name === 'art') {
//       setFiles(prev => ({ ...prev, art: fileList[0] }))
//     }
//   }

//   const addArtistRole = () => {
//     setFormData(prev => ({
//       ...prev,
//       Roles: [...(prev.Roles || []), { artistRole: '', artistRoleName: '' }],
//     }))
//   }

//   const removeArtistRole = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       Roles: prev.Roles?.filter((_, i) => i !== index) || [],
//     }))
//   }

//   const updateArtistRole = (index: number, field: 'artistRole' | 'artistRoleName', value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       Roles: prev.Roles?.map((role, i) =>
//         i === index ? { ...role, [field]: value } : role
//       ) || [],
//     }))
//   }

//   const togglePlatform = (platform: string) => {
//     const newPlatforms = selectedPlatforms.includes(platform)
//       ? selectedPlatforms.filter(p => p !== platform)
//       : [...selectedPlatforms, platform]

//     setSelectedPlatforms(newPlatforms)
//     handleInputChange('distributionPlatform', newPlatforms)
//   }

//   const uploadFiles = async (): Promise<{ songUrls: string[]; artworkUrl?: string }> => {
//     const formData = new FormData()

//     // Add songs
//     files.songs.forEach(song => {
//       formData.append('songs', song)
//     })

//     // Add artwork
//     if (files.art) {
//       formData.append('artwork', files.art)
//     }

//     formData.append('releaseId', 'temp-' + Date.now())

//     const response = await fetch('/api/upload', {
//       method: 'POST',
//       body: formData,
//     })

//     if (!response.ok) {
//       throw new Error('Upload failed')
//     }

//     const result = await response.json()
//     const songUrls = result.files
//       .filter((file: FileUploadResult) => file.type === 'song')
//       .map((file: FileUploadResult) => file.url)

//     const artworkUrl = result.files
//       .find((file: FileUploadResult) => file.type === 'artwork')?.url

//     return { songUrls, artworkUrl }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setErrors({})

//     try {
//       // Validate form data
//       const validatedData = formSchema.parse({
//         ...formData,
//         songs: files.songs,
//         art: files.art,
//       })

//       setIsUploading(true)

//       // Upload files first
//       const { songUrls, artworkUrl } = await uploadFiles()

//       // Create release
//       await createRelease({
//         variables: {
//           input: {
//             title: validatedData.title,
//             language: validatedData.language,
//             genre: validatedData.genre,
//             secondaryGenre: validatedData.secondaryGenre,
//             description: validatedData.description,
//             features: validatedData.features,
//             releaseType: validatedData.releaseType,
//             version: validatedData.version,
//             label: validatedData.lable,
//             referenceNo: validatedData.referenceNo,
//             upc: validatedData.upc,
//             releaseDate: validatedData.releaseDate,
//             digitalReleaseDate: validatedData.digitalReleaseDate,
//             licenseType: validatedData.licenseType,
//             publishingRegions: validatedData.publishingRegions,
//             budget: validatedData.budget,
//             artistRoles: validatedData.Roles,
//             legalOwner: validatedData.legalOwner,
//             legalOwnerRelease: validatedData.legalOwnerRelease,
//             distributionPlatforms: validatedData.distributionPlatform,
//             songFiles: songUrls,
//             artworkFile: artworkUrl,
//           },
//         },
//       })

//       alert('Release created successfully!')
//       // Reset form
//       setFormData({
//         Roles: [{ artistRole: '', artistRoleName: '' }],
//         distributionPlatform: [],
//         legalOwner: { legalOwnerName: '', legalOwnerYear: '' },
//         legalOwnerRelease: { legalOwnerReleaseName: '', legalOwnerReleaseYear: '' },
//       })
//       setFiles({ songs: [] })
//       setSelectedPlatforms([])
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const fieldErrors: Record<string, string> = {}
//         error.errors.forEach(err => {
//           if (err.path) {
//             fieldErrors[err.path.join('.')] = err.message
//           }
//         })
//         setErrors(fieldErrors)
//       } else {
//         console.error('Error creating release:', error)
//         alert('Error creating release. Please try again.')
//       }
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white">
//       <form onSubmit={handleSubmit} className="space-y-8">
//         <div className="border-b pb-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Release</h1>
//           <p className="text-gray-600">Fill out all the required information to submit your music release.</p>
//         </div>

//         {/* Basic Information */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
//               <input
//                 type="text"
//                 value={formData.title || ''}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter release title"
//               />
//               {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
//               <input
//                 type="text"
//                 value={formData.language || ''}
//                 onChange={(e) => handleInputChange('language', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., English, Spanish"
//               />
//               {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Primary Genre *</label>
//               <input
//                 type="text"
//                 value={formData.genre || ''}
//                 onChange={(e) => handleInputChange('genre', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., Pop, Rock, Hip-Hop"
//               />
//               {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Genre</label>
//               <input
//                 type="text"
//                 value={formData.secondaryGenre || ''}
//                 onChange={(e) => handleInputChange('secondaryGenre', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Optional secondary genre"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Release Type *</label>
//               <select
//                 value={formData.releaseType || ''}
//                 onChange={(e) => handleInputChange('releaseType', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select release type</option>
//                 {releaseTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//               {errors.releaseType && <p className="text-red-500 text-sm mt-1">{errors.releaseType}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
//               <input
//                 type="text"
//                 value={formData.version || ''}
//                 onChange={(e) => handleInputChange('version', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., Deluxe Edition, Remastered"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
//             <textarea
//               value={formData.description || ''}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Describe your release (minimum 10 characters)"
//             />
//             {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
//             <input
//               type="text"
//               value={formData.features || ''}
//               onChange={(e) => handleInputChange('features', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Featured artists or collaborations"
//             />
//           </div>
//         </div>

//         {/* File Uploads */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Media Files</h2>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Songs *</label>
//             <input
//               type="file"
//               name="songs"
//               multiple
//               accept="audio/*"
//               onChange={handleFileChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//             {files.songs.length > 0 && (
//               <div className="mt-2">
//                 <p className="text-sm text-gray-600 font-medium">Selected files:</p>
//                 <ul className="text-sm text-gray-600 mt-1 space-y-1">
//                   {files.songs.map((file, index) => (
//                     <li key={index} className="flex items-center">
//                       <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                       {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {errors.songs && <p className="text-red-500 text-sm mt-1">{errors.songs}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Album Artwork</label>
//             <input
//               type="file"
//               name="art"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//             {files.art && (
//               <p className="text-sm text-gray-600 mt-2">
//                 Selected: {files.art.name} ({(files.art.size / 1024 / 1024).toFixed(2)} MB)
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Artist Roles */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Artist Information</h2>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">Artist Roles *</label>
//             {formData.Roles?.map((role, index) => (
//               <div key={index} className="flex gap-3 mb-3 p-3 border border-gray-200 rounded-md bg-gray-50">
//                 <input
//                   type="text"
//                   placeholder="Role (e.g., Artist, Producer, Songwriter)"
//                   value={role.artistRole}
//                   onChange={(e) => updateArtistRole(index, 'artistRole', e.target.value)}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={role.artistRoleName}
//                   onChange={(e) => updateArtistRole(index, 'artistRoleName', e.target.value)}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {formData.Roles!.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeArtistRole(index)}
//                     className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addArtistRole}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//             >
//               Add Artist Role
//             </button>
//             {errors.Roles && <p className="text-red-500 text-sm mt-1">{errors.Roles}</p>}
//           </div>
//         </div>

//         {/* Release Information */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Release Information</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
//               <input
//                 type="text"
//                 value={formData.lable || ''}
//                 onChange={(e) => handleInputChange('lable', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Record label"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
//               <input
//                 type="text"
//                 value={formData.referenceNo || ''}
//                 onChange={(e) => handleInputChange('referenceNo', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Internal reference number"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">UPC</label>
//               <input
//                 type="text"
//                 value={formData.upc || ''}
//                 onChange={(e) => handleInputChange('upc', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Universal Product Code"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">License Type *</label>
//               <select
//                 value={formData.licenseType || ''}
//                 onChange={(e) => handleInputChange('licenseType', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select license type</option>
//                 {licenseTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//               {errors.licenseType && <p className="text-red-500 text-sm mt-1">{errors.licenseType}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Release Date *</label>
//               <input
//                 type="date"
//                 value={formData.releaseDate ? formData.releaseDate.toISOString().split('T')[0] : ''}
//                 onChange={(e) => handleInputChange('releaseDate', new Date(e.target.value))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               {errors.releaseDate && <p className="text-red-500 text-sm mt-1">{errors.releaseDate}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Digital Release Date *</label>
//               <input
//                 type="date"
//                 value={formData.digitalReleaseDate ? formData.digitalReleaseDate.toISOString().split('T')[0] : ''}
//                 onChange={(e) => handleInputChange('digitalReleaseDate', new Date(e.target.value))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               {errors.digitalReleaseDate && <p className="text-red-500 text-sm mt-1">{errors.digitalReleaseDate}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Publishing Regions *</label>
//               <input
//                 type="text"
//                 value={formData.publishingRegions || ''}
//                 onChange={(e) => handleInputChange('publishingRegions', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., Worldwide, US Only, Europe"
//               />
//               {errors.publishingRegions && <p className="text-red-500 text-sm mt-1">{errors.publishingRegions}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Budget *</label>
//               <input
//                 type="text"
//                 value={formData.budget || ''}
//                 onChange={(e) => handleInputChange('budget', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., $10,000"
//               />
//               {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
//             </div>
//           </div>
//         </div>

//         {/* Distribution Platforms */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Distribution</h2>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">Distribution Platforms *</label>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {platforms.map(platform => (
//                 <label key={platform} className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={selectedPlatforms.includes(platform)}
//                     onChange={() => togglePlatform(platform)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <span className="text-sm text-gray-700">{platform}</span>
//                 </label>
//               ))}
//             </div>
//             {errors.distributionPlatform && <p className="text-red-500 text-sm mt-1">{errors.distributionPlatform}</p>}
//           </div>
//         </div>

//         {/* Legal Information */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Legal Information</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Legal Owner Name *</label>
//               <input
//                 type="text"
//                 value={formData.legalOwner?.legalOwnerName || ''}
//                 onChange={(e) => handleNestedInputChange('legalOwner', 'legalOwnerName', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Legal owner of the master recording"
//               />
//               {errors['legalOwner.legalOwnerName'] && <p className="text-red-500 text-sm mt-1">{errors['legalOwner.legalOwnerName']}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Legal Owner Year *</label>
//               <input
//                 type="text"
//                 value={formData.legalOwner?.legalOwnerYear || ''}
//                 onChange={(e) => handleNestedInputChange('legalOwner', 'legalOwnerYear', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., 2024"
//               />
//               {errors['legalOwner.legalOwnerYear'] && <p className="text-red-500 text-sm mt-1">{errors['legalOwner.legalOwnerYear']}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Legal Owner Release Name *</label>
//               <input
//                 type="text"
//                 value={formData.legalOwnerRelease?.legalOwnerReleaseName || ''}
//                 onChange={(e) => handleNestedInputChange('legalOwnerRelease', 'legalOwnerReleaseName', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Legal owner of the release"
//               />
//               {errors['legalOwnerRelease.legalOwnerReleaseName'] && <p className="text-red-500 text-sm mt-1">{errors
