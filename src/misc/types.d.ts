declare namespace PenguinModTypes {
    // IMPORTANT CLASSES - should have descendants
    /** A basic user class with all of the info that must be present */
    interface BaseUser {
        /** The ID of the user. */
        id: string;
        /** The username of the user. */
        username: string;
        /** The username of the user, with capitalization preserved. */
        real_username: string;
    }
    /** A basic project class with all of the info that must be present */
    interface BaseProject {
        /** The ID of the project. */
        id: string;
        /** The title of the project. */
        title: string;
    }

    // STUBS - should not extend base classes since not all base info is needed to identify smth
    /** A small bit of user info when not all info is needed */
    interface StubUser {
        /** The ID of the user. */
        id: string;
        /** The username of the user. */
        username: string;
    }
    /** A small bit of project info when not all info is needed */
    interface StubProject {
        /** The ID of the project. */
        id: string;
        /** The title of the project. */
        title?: string;
    }

    // EXTENSIONS OF THE IMPORTANT CLASSES
    /** A profile attached to a user. */
    interface UserProfile extends BaseUser {
        /** The badges of the user. */
        badges: string[];
        /** If the user is a donator. */
        donator: boolean;
        /** The rank of the user. 0 represents new penguin, 1 represents penguin. */
        rank: number;
        /** The user's bio. */
        bio: string;
        /** the user's featured project. */
        myFeaturedProject: number;
        /** An enum-ish of the titles. Each integer represents a different title. */
        myFeaturedProjectTitle: number;
        /** The follower count of the user. */
        followers: number;
        /** If the user can rank up. */
        canrankup: boolean;
        /** If the user's account is private. */
        privateProfile: boolean;
        /** If people the user follows can see the users account when the account is private. */
        canFollowingSeeProfile: boolean;
        /** If the user is following you. */
        isFollowing: boolean;
    }
    /** Data related to the currently logged-in user. */
    interface UserIdentity extends BaseUser {
        /** If the user is an admin or not. */
        admin: boolean;
        /** If the user is a mod or not */
        approver: boolean;
        /** if the user is banned or not. */
        isBanned: boolean;
        /** Any arbitrary badge IDs the user owns. */
        badges: string[];
        /** If the user is a donator or not. */
        donator: boolean;
        /** The user's rank. 0 for new penguin, 1 for penguin. */
        rank: number;
        /** The ID of the project featured on the users profile. Defaults to -1. */
        myFeaturedProject: number;
        /** The index of the subtitle of the project featured on the users profile. Defaults to -1. */
        myFeaturedProjectTitle: number;
        /** The amount of cubes this user owns. Unused currently. */
        cubes: number;
        /** Unix timestamp (with milliseconds) of the users first login. */
        firstLogin: number;
        /** Unix timestamp (with milliseconds) of the users most recent login. */
        lastLogin: number;
        /** Unix timestamp (with milliseconds) of the users last project upload/update. */
        lastUpload: number;
        /** The users email. */
        email: string;
        /** If the users email is verified or not. */
        emailVerified: boolean;
        /** If the users birthday is entered or not. */
        birthdayEntered: boolean;
        /** If the users country is entered or not. */
        countryEntered: boolean;
        /** The users country of residence, in country-code form. */
        country: string;
    }

    interface Project extends BaseProject {
        /** Some info on the author of the project, or a user ID depending on the endpoint. */
        author: PenguinModTypes.StubUser | string | null;
        /** The instructions attached to this project. */
        instructions?: string;
        /** The notes attached to this project. */
        notes?: string;
        /** If this project is a remix, this will be the project ID of the project it remixed. Either `"0"` or not defined for non-remix projects. */
        remix: string | "0" | null;
        /** True if this project is featured. */
        featured: boolean;
        /** The amount of times someone has visited the project page for this project. */
        views: number;
        /** The time in milliseconds that this project was published. */
        date: number;
        /** The time in milliseconds that this project was last updated. */
        lastUpdate?: number;
        /**
         * The age-rating of this project.
         * This property has specific intended values, but they have not been determined nor implemented yet.
         */
        rating?: string;
        /** True if this project can be seen by others */
        public?: boolean;
        /** True if this project is soft-rejected (hidden for review) */
        softRejected?: boolean;
        /** True if this project is hard-rejected (subject for deletion.) */
        hardReject?: boolean;
        /** The time in milliseconds that this project was hard-rejected. */
        hardRejectTime?: number;
        /** The amount of times this project has been seen on the site. */
        impressions?: number;
        /** True if this project cannot be featured. */
        noFeature?: boolean;
        /** The time in milliseconds that this project was featured. */
        featureDate?: number;
        /** True if this project was manually featured. */
        manuallyFeatured?: boolean;
    }

    // UNIQUE CLASSES
    /** Fields and content attached to a Message */
    interface MessageBody {
        /** The type of message that this MessageBody is apart of. */
        type: "newBadge" | "projectFeatured" | "delete" | "reject" | "modMessage" | "disputeResponse" | "restored" | "remix" | "followerAdded" | "tempban" | "ban" | "unban" | "custom";
        /** Message content for MessageBody of type `reject`, `delete`, `modMessage`, `disputeResponse` */
        message?: string;
        /** A punishment reason for MessageBody of type `tempban`, `ban` */
        reason?: string;
        /** The affected project's title, used in `delete`, `reject` (sometimes) */
        title?: string;
        /** A project ID, used in `remix` to point to the new remix's ID. */
        projectID?: string;
        /** A small bit of project info, used in `projectFeatured`, `reject`, `restored` */
        project?: PenguinModTypes.StubProject;
        /** A small bit of project info, used in `remix` to refer to the remixed project */
        oldProject?: PenguinModTypes.StubProject;
        /** A small bit of project info, used in `remix` to refer to the new remix */
        newProject?: PenguinModTypes.StubProject;
        /** A badge ID, used in `newBadge` to reference the added badge. */
        badge?: string;
        /** A small bit of user info, or a user id depending on the endpoint. Used in `followerAdded` */
        user?: PenguinModTypes.StubUser | string | null;
        /** The amount of time given in a punishment, used in `tempban` */
        time?: number;
        /** Whether or not the project rejection was a hard reject (project deletion). Used in `reject` */
        hardReject?: boolean;
        /** Custom text added to a `custom` message. Note that this type is not accessible in the API and is only recognized by the front-end. Used in `custom` */
        text?: string;
    }
    /** A PenguinMod message to a user. */
    interface Message {
        /** A unique ID of the message. */
        id: string;
        /** ID of the person receiving the message */
        receiver: string;
        /** The body of the message, including its type */
        message: MessageBody;
        /** True if the message is disputable (can be replied to), false if not */
        disputable: boolean;
        /** Whether or not the message has been read. */
        read: boolean;
        /** The time in milliseconds when this message was sent. */
        date: number;
        /** A project ID attached to this message, for message types that imply a project ID is neccessary. Will be 0 or not defined if not provided. */
        projectID: string | 0 | null;
    }

    /** Fields and content attached to a FeedItem */
    interface FeedItemBody {
        /** The user ID or project ID. Depends on the type of FeedItem. */
        id?: string;
        /** The username of the user who followed you, if the FeedItem type is `"follow"`. */
        username?: string;
        /** The name of the uploaded project or remix. Depends on the type of FeedItem. */
        name?: string;
    }
    /**
     * A small message in the user's feed, related to
     * something that the user likely wants to know about.
     */
    interface FeedItem {
        /** The type of the feed item. */
        type: "follow" | "upload" | "remix";
        /** The time in milliseconds when this feed item was made. */
        date: number;
        /** The time in milliseconds when this feed item will expire. */
        expireAt: number;
        /** Extra data attached to this feed item. Will be formatted differently for different FeedItem types. */
        data?: FeedItemBody;
        /** The user ID attached to this feed item. Used to see who followed, uploaded, or remixed. */
        id?: string;
        /** The username attached to this feed item. Used to see who followed, uploaded, or remixed. */
        username?: string;
    }

    /** Profanity filter applied to many parts of the site. */
    interface ProfanityList {
        /** Only flagged under certain conditions. */
        illegalWords: string[];
        /** Only flagged under certain conditions. */
        illegalWebsites: string[];
        /** Only flagged under certain conditions. */
        spacedOutWordsOnly: string[];
        /** Only flagged under certain conditions. */
        potentiallyUnsafeWords: string[];
        /** Only flagged under certain conditions. */
        potentiallyUnsafeWordsSpacedOut: string[];
        /**
         * A whitelist of permitted extension IDs (ie, `pen`, `text`, `translate`)
         * or extension URLs (ie, `"https://example.com/files/extension.js"`)
         * that are considered safe to use.
         */
        legalExtensions: string[];
        /** Only flagged under certain conditions. */
        unsafeUsernames: string[];
        /** Only flagged under certain conditions. */
        potentiallyUnsafeUsernames: string[];
    }

    /** Stats about the server and its contents. */
    interface ServerStatistics {
        /** Counts how many accounts are on the server */
        userCount: number | undefined;
        /** Counts how many banned accounts are on the server */
        bannedCount: number | undefined;
        /** Counts how many projects are on the server */
        projectCount: number | undefined;
        /** Counts how many projects are remixes on the server */
        remixCount: number | undefined;
        /** Counts how many accounts are featured on the server */
        featuredCount: number | undefined;
        /** Counts the total amount of views across all projects that are on the server */
        totalViews: number | undefined;
        /** How much memory is being used on the server. Currently disabled. */
        current_mem_usage: any | null;
        /** Currently disabled. */
        comp_mem_usage: {} | null;
        /** Any information about the MongoDB process. Currently disabled. */
        mongodb_stats: {} | null;
    }

    /** A search query in object form. Arbitrary properties may also be present. */
    interface SearchQuery {
        /** The actual search query, text that should be looked for. */
        query: string;

        /** Sorts the results by a certain condition. */
        sort?: "newest" | "oldest" | "views" | "votes" | "loves";
        /** Only shows results before the specified date (if it can be read as a date). */
        before?: string;
        /** Only shows results after the specified date (if it can be read as a date). */
        after?: string;
        /** Reverses the results before paging is done. */
        reverse?: boolean;

        /** Only show results with this ID. */
        id?: string;
        /** Show only content by the specified user. */
        by?: string;
        /** Show only projects remixing the specified project ID. */
        remixes?: string;
        /** If specified, show only studios in results (true) or exclude studios in results (false) */
        studio?: boolean;
        /** If specified, show only myself in results (true) or exclude myself in results (false) */
        me?: boolean;
        /** If specified, include featured (true) or exclude featured (false) */
        featured?: boolean;
        /** If specified, show only unranked projects in results (true) or exclude unranked projects in results (false). May not be available to all users. */
        unranked?: boolean;
    }
}