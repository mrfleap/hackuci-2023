import requests

def get_professors(school_id: int, file_path: str) -> list:
    raw = requests.post("https://www.ratemyprofessors.com/graphql", 
                        headers={"referrer": f"https://www.ratemyprofessors.com/search/teachers?query=*&sid={school_id}",        
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
                                    "Accept": "*/*",
                                    "Accept-Language": "en-US,en;q=0.5",
                                    "Content-Type": "application/json",
                                    "Authorization": "Basic dGVzdDp0ZXN0",
                                    "Sec-Fetch-Dest": "empty",
                                    "Sec-Fetch-Mode": "cors",
                                    "Sec-Fetch-Site": "same-origin"}, 
                        data = "{\"query\":\"query TeacherSearchPaginationQuery(\\n  $count: Int!\\n  $cursor: String\\n  $query: TeacherSearchQuery!\\n) {\\n  search: newSearch {\\n    ...TeacherSearchPagination_search_1jWD3d\\n  }\\n}\\n\\nfragment TeacherSearchPagination_search_1jWD3d on newSearch {\\n  teachers(query: $query, first: $count, after: $cursor) {\\n    didFallback\\n    edges {\\n      cursor\\n      node {\\n        ...TeacherCard_teacher\\n        id\\n        __typename\\n      }\\n    }\\n    pageInfo {\\n      hasNextPage\\n      endCursor\\n    }\\n    resultCount\\n    filters {\\n      field\\n      options {\\n        value\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment TeacherCard_teacher on Teacher {\\n  id\\n  legacyId\\n  avgRating\\n  numRatings\\n  ...CardFeedback_teacher\\n  ...CardSchool_teacher\\n  ...CardName_teacher\\n  ...TeacherBookmark_teacher\\n}\\n\\nfragment CardFeedback_teacher on Teacher {\\n  wouldTakeAgainPercent\\n  avgDifficulty\\n}\\n\\nfragment CardSchool_teacher on Teacher {\\n  department\\n  school {\\n    name\\n    id\\n  }\\n}\\n\\nfragment CardName_teacher on Teacher {\\n  firstName\\n  lastName\\n}\\n\\nfragment TeacherBookmark_teacher on Teacher {\\n  id\\n  isSaved\\n}\\n\",\"variables\":{\"count\":3647,\"cursor\":\"YXJyYXljb25uZWN0aW9uOjc=\",\"query\":{\"text\":\"\",\"schoolID\":\"U2Nob29sLTEwNzQ=\",\"fallback\":true,\"departmentID\":null}}}"
                        )
    
    f = open(file_path, "w")
    f.write(raw.content.decode("utf-8"))
    f.close

if __name__ == "__main__":
    uci = 1704
    uci_profs = get_professors(uci, "uci_rmp_raw_text.txt")