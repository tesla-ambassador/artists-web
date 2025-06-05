/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	ArtistInput:{

	},
	CollaboratorInput:{

	},
	ExplicitLyrics: "enum" as const,
	ReleaseStatus: "enum" as const,
	ReleaseType: "enum" as const,
	LicenceType: "enum" as const,
	PriceCategory: "enum" as const,
	ArtworkCopyrightInput:{

	},
	ReleaseOwnerInput:{

	},
	SongInput:{
		explicit_lyrics:"ExplicitLyrics",
		licence_type:"LicenceType",
		legal_owner_of_release:"ReleaseOwnerInput",
		artists:"CollaboratorInput"
	},
	SongStatus: "enum" as const,
	ListEntityByArtistInput:{

	},
	SongUpdateInput:{
		explicit_lyrics:"ExplicitLyrics",
		licence_type:"LicenceType",
		legal_owner_of_release:"ReleaseOwnerInput",
		artists:"CollaboratorInput"
	},
	BasicSongInput:{
		artists:"ArtistInput"
	},
	UserInput:{

	},
	PaginatedArtistInput:{

	},
	IdentityInput:{

	},
	ReleaseInfoInput:{
		release_type:"ReleaseType",
		artists:"CollaboratorInput",
		identity:"IdentityInput"
	},
	LicenceInput:{
		licence_type:"LicenceType",
		legal_owner_of_work:"ReleaseOwnerInput",
		legal_owner_of_release:"ReleaseOwnerInput",
		price_category:"PriceCategory"
	},
	ReleaseInput:{
		release_info:"ReleaseInfoInput",
		licence:"LicenceInput",
		status:"ReleaseStatus"
	},
	ReleaseUpdateInput:{
		release_info:"ReleaseInfoInput",
		licence:"LicenceInput",
		status:"ReleaseStatus"
	},
	SongReleaseInput:{

	},
	SearchField: "enum" as const,
	LatexSearchInput:{
		entity:"SearchField"
	},
	SimpleSearchInput:{

	},
	AddVideoInput:{

	},
	Mutation:{
		putSong:{
			input:"SongInput"
		},
		updateSong:{
			input:"SongUpdateInput"
		},
		putRelease:{
			input:"ReleaseInput"
		},
		updateRelease:{
			input:"ReleaseUpdateInput"
		},
		deleteRelease:{

		},
		deleteSong:{

		},
		addSongToRelease:{

		},
		deleteSongFromRelease:{

		},
		updateUser:{
			input:"UserInput"
		},
		likeSong:{

		},
		unlikeSong:{

		},
		follow:{

		},
		unfollow:{

		},
		createImgUploadUrl:{

		},
		addVideo:{
			input:"AddVideoInput"
		},
		deleteVideo:{

		}
	},
	Query:{
		searchItem:{
			input:"LatexSearchInput"
		},
		searchAll:{
			input:"SimpleSearchInput"
		},
		getSongById:{

		},
		getAllSongs:{

		},
		getSongsByArtist:{
			input:"PaginatedArtistInput"
		},
		getSongsOfRelease:{

		},
		getReleasesOfSong:{

		},
		getReleaseById:{

		},
		getReleasesByArtist:{
			input:"PaginatedArtistInput"
		},
		getUserById:{

		},
		listArtists:{

		},
		getCountries:{

		},
		getIsSongLiked:{

		},
		getIsFollowed:{

		},
		listLikedSongIds:{

		},
		getVideoUploadUrl:{

		},
		listAllVideosByArtist:{
			input:"ListEntityByArtistInput"
		},
		getVideo:{

		}
	}
}

export const ReturnTypes: Record<string,any> = {
	CollaboratorOutput:{
		name:"String",
		role:"String",
		ownership:"Int"
	},
	ArtworkCopyrightOutput:{
		name:"String",
		year:"Int"
	},
	ReleaseOwnerOutput:{
		name:"String",
		year:"Int"
	},
	SongOutput:{
		id:"ID",
		audio_path:"String",
		album_art:"String",
		title:"String",
		duration:"Int",
		lyrics:"String",
		explicit_lyrics:"ExplicitLyrics",
		licence_type:"LicenceType",
		legal_owner_of_release:"ReleaseOwnerOutput",
		primary_genre:"String",
		secondary_genre:"String",
		remix_or_version:"String",
		available_separately:"Boolean",
		is_instrumental:"Boolean",
		language_of_the_lyrics:"String",
		secondary_language_of_the_lyrics:"String",
		new_isrc_code:"Boolean",
		isrc_code:"String",
		iswc_code:"String",
		artists:"CollaboratorOutput",
		notes:"String"
	},
	ArtistOutput:{
		id:"ID",
		name:"String"
	},
	BasicSongOutput:{
		id:"ID",
		duration:"Int",
		release_art:"String",
		audio_path:"String",
		title:"String",
		artists:"ArtistOutput"
	},
	OwnershipOutput:{
		name:"String",
		share:"Int"
	},
	UserOutput:{
		sub:"String",
		name:"String",
		locale:"String",
		nickname:"String",
		bio:"String",
		email:"String",
		preferred_username:"String",
		based_region:"String",
		based_country:"String",
		address:"String",
		website:"String",
		updated_at:"String",
		picture:"String",
		followers:"String",
		monthly_plays:"String",
		downloads:"String",
		is_artist:"Boolean",
		country:"String",
		email_alerts:"String",
		instagram:"String",
		twitter:"String",
		youtube:"String",
		facebook:"String",
		role:"String",
		influencers:"String",
		genre:"String"
	},
	PaginatedSongsOutput:{
		nextToken:"String",
		songs:"SongOutput"
	},
	IdentityOutput:{
		request_upc:"Boolean",
		upc:"String",
		request_ref_no:"Boolean",
		reference_number:"String"
	},
	ReleaseInfoOutput:{
		version:"String",
		title_language:"String",
		release_type:"ReleaseType",
		cover_art:"String",
		primary_genre:"String",
		secondary_genre:"String",
		artists:"CollaboratorOutput",
		label:"String",
		identity:"IdentityOutput",
		release_description:"String"
	},
	LicenceOutput:{
		digital_release_date:"String",
		original_release_date:"String",
		licence_type:"LicenceType",
		legal_owner_of_work:"ReleaseOwnerOutput",
		legal_owner_of_release:"ReleaseOwnerOutput",
		price_category:"PriceCategory",
		excluded_territories:"String"
	},
	ReleaseOutput:{
		id:"ID",
		title:"String",
		release_info:"ReleaseInfoOutput",
		licence:"LicenceOutput",
		distribution_platforms:"String",
		status:"ReleaseStatus"
	},
	SongReleaseOutput:{
		id:"ID",
		title:"String"
	},
	ImgUploadResult:{
		id:"ID",
		uploadURL:"String"
	},
	ImageUploadUrlOutput:{
		result:"ImgUploadResult",
		result_info:"String",
		success:"Boolean",
		errors:"String",
		messages:"String"
	},
	SongSearchField:{
		id:"ID",
		entity_type:"SearchField",
		artists:"String",
		title:"String",
		subtitle:"String",
		lyrics:"String",
		genre:"String",
		publisher:"String",
		release_art:"String",
		audio_path:"String",
		stream_count:"Int",
		duration:"Int",
		release_date:"String"
	},
	ReleaseSearchField:{
		id:"ID",
		entity_type:"SearchField",
		name:"String",
		release_date:"String",
		release_art:"String"
	},
	ArtistSearchField:{
		id:"ID",
		entity_type:"SearchField",
		name:"String",
		bio:"String",
		role:"String",
		picture:"String"
	},
	SearchResultFields:{
		"...on SongSearchField":"SongSearchField",
		"...on ReleaseSearchField":"ReleaseSearchField",
		"...on ArtistSearchField":"ArtistSearchField"
	},
	SearchHit:{
		id:"ID",
		fields:"SearchResultFields"
	},
	SearchResult:{
		found:"Int",
		start:"Int",
		hit:"SearchHit"
	},
	AllSearchHit:{
		artist:"ArtistSearchField",
		release:"ReleaseSearchField",
		song:"SongSearchField"
	},
	AllSearchResult:{
		found:"Int",
		start:"Int",
		hit:"AllSearchHit"
	},
	PaginatedReleasesOutput:{
		releases:"ReleaseOutput",
		nextToken:"String"
	},
	PaginatedListArtistsOutput:{
		artists:"UserOutput",
		nextToken:"String"
	},
	PaginatedBasicSongOutput:{
		songs:"BasicSongOutput",
		nextToken:"String"
	},
	PaginatedSongIdsOutput:{
		songs:"ID",
		nextToken:"String"
	},
	PaginatedReleaseOutput:{
		releases:"ReleaseOutput",
		nextToken:"String"
	},
	TransactWriteOutput:{
		message:"String",
		id:"ID"
	},
	GetCountriesOutput:{
		countries:"String"
	},
	SuccessOutput:{
		success:"Boolean"
	},
	VideoOutput:{
		id:"ID",
		title:"String",
		streamId:"ID",
		description:"String",
		thumbnail_ts:"Int"
	},
	PaginatedVideosOutput:{
		videos:"VideoOutput",
		nextToken:"ID"
	},
	GetVideoUploadUrlOutput:{
		uploadUrl:"String",
		streamId:"ID"
	},
	Mutation:{
		putSong:"TransactWriteOutput",
		updateSong:"TransactWriteOutput",
		putRelease:"ReleaseOutput",
		updateRelease:"ReleaseOutput",
		deleteRelease:"ReleaseOutput",
		deleteSong:"SongOutput",
		addSongToRelease:"SuccessOutput",
		deleteSongFromRelease:"SuccessOutput",
		updateUser:"UserOutput",
		likeSong:"TransactWriteOutput",
		unlikeSong:"TransactWriteOutput",
		follow:"TransactWriteOutput",
		unfollow:"TransactWriteOutput",
		createImgUploadUrl:"ImageUploadUrlOutput",
		addVideo:"VideoOutput",
		deleteVideo:"SuccessOutput"
	},
	Query:{
		searchItem:"SearchResult",
		searchAll:"AllSearchResult",
		getSongById:"SongOutput",
		getAllSongs:"SongOutput",
		getSongsByArtist:"PaginatedSongsOutput",
		getSongsOfRelease:"PaginatedSongsOutput",
		getReleasesOfSong:"PaginatedReleaseOutput",
		getReleaseById:"ReleaseOutput",
		getReleasesByArtist:"PaginatedReleasesOutput",
		getUser:"UserOutput",
		getUserById:"UserOutput",
		listArtists:"PaginatedListArtistsOutput",
		getCountries:"GetCountriesOutput",
		getIsSongLiked:"Boolean",
		getIsFollowed:"Boolean",
		listLikedSongIds:"PaginatedSongIdsOutput",
		getVideoUploadUrl:"GetVideoUploadUrlOutput",
		listAllVideosByArtist:"PaginatedVideosOutput",
		getVideo:"VideoOutput"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}