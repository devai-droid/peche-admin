import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { Button, Chip, TextField } from "@mui/material"
import { CreateSearchKeywordDto } from "@/lib/orval/model"
import { useEffect, useState } from "react"
import {
  useSearchKeywordControllerFindMany,
  searchKeywordControllerRemove,
  searchKeywordControllerCreate,
} from "@/lib/orval/search-keywords/search-keywords"

const KeywordsList = () => {
  const { data: keywordsListKor, refetch: refetchKeywordsKor } = useSearchKeywordControllerFindMany(
    {
      page: 1,
      limit: 10,
      languageLocale: "ko",
    },
  )
  const { data: keywordsListEng, refetch: refetchKeywordsEng } = useSearchKeywordControllerFindMany(
    {
      page: 1,
      limit: 10,
      languageLocale: "en",
    },
  )
  const { data: keywordsListChn, refetch: refetchKeywordsChn } = useSearchKeywordControllerFindMany(
    {
      page: 1,
      limit: 10,
      languageLocale: "zh",
    },
  )
  const { data: keywordsListChnTW, refetch: refetchKeywordsChnTW } =
    useSearchKeywordControllerFindMany({
      page: 1,
      limit: 10,
      languageLocale: "zh-TW",
    })
  const { data: keywordsListJpn, refetch: refetchKeywordsJpn } = useSearchKeywordControllerFindMany(
    {
      page: 1,
      limit: 10,
      languageLocale: "ja",
    },
  )
  const { data: keywordsListTha, refetch: refetchKeywordsTha } = useSearchKeywordControllerFindMany(
    {
      page: 1,
      limit: 10,
      languageLocale: "th",
    },
  )
  const [loading, setLoading] = useState(false)
  // State to manage the input value and list of keywords
  const [keywordKor, setKeywordKor] = useState<string>("")
  const [keywordsKor, setKeywordsKor] = useState<string[]>([])
  const [keywordEng, setKeywordEng] = useState<string>("")
  const [keywordsEng, setKeywordsEng] = useState<string[]>([])
  const [keywordChn, setKeywordChn] = useState<string>("")
  const [keywordsChn, setKeywordsChn] = useState<string[]>([])
  const [keywordChnTW, setKeywordChnTW] = useState<string>("")
  const [keywordsChnTW, setKeywordsChnTW] = useState<string[]>([])
  const [keywordJpn, setKeywordJpn] = useState<string>("")
  const [keywordsJpn, setKeywordsJpn] = useState<string[]>([])
  const [keywordTha, setKeywordTha] = useState<string>("")
  const [keywordsTha, setKeywordsTha] = useState<string[]>([])

  useEffect(() => {
    if (keywordsListKor && keywordsListKor.items) {
      const initialKeywords = keywordsListKor.items.map((item) => item.keyword)
      setKeywordsKor(initialKeywords)
    }
    if (keywordsListEng && keywordsListEng.items) {
      const initialKeywords = keywordsListEng.items.map((item) => item.keyword)
      setKeywordsEng(initialKeywords)
    }
    if (keywordsListChn && keywordsListChn.items) {
      const initialKeywords = keywordsListChn.items.map((item) => item.keyword)
      setKeywordsChn(initialKeywords)
    }
    if (keywordsListChnTW && keywordsListChnTW.items) {
      const initialKeywords = keywordsListChnTW.items.map((item) => item.keyword)
      setKeywordsChn(initialKeywords)
    }
    if (keywordsListJpn && keywordsListJpn.items) {
      const initialKeywords = keywordsListJpn.items.map((item) => item.keyword)
      setKeywordsJpn(initialKeywords)
    }
    if (keywordsListTha && keywordsListTha.items) {
      const initialKeywords = keywordsListTha.items.map((item) => item.keyword)
      setKeywordsTha(initialKeywords)
    }
  }, [keywordsListKor, keywordsListEng, keywordsListChn, keywordsListJpn, keywordsListTha])

  // Function to add a keyword
  const handleAddKeywordKor = async () => {
    const keywordDataKor: CreateSearchKeywordDto = {
      keyword: keywordKor,
      order: 0,
      languageLocale: "ko",
    }
    try {
      setLoading(true)
      await searchKeywordControllerCreate(keywordDataKor)
      setKeywordsKor([...keywordsKor, keywordKor])
      setKeywordKor("")
      refetchKeywordsKor()
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKeywordKor = async (id: string) => {
    try {
      setLoading(true)
      await searchKeywordControllerRemove(id)
      refetchKeywordsKor()
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeywordEng = async () => {
    const keywordDataEng: CreateSearchKeywordDto = {
      keyword: keywordEng,
      order: 0,
      languageLocale: "en",
    }
    try {
      setLoading(true)
      await searchKeywordControllerCreate(keywordDataEng)
      setKeywordsEng([...keywordsEng, keywordEng])
      setKeywordEng("")
      refetchKeywordsEng()
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKeywordEng = async (id: string) => {
    try {
      setLoading(true)
      await searchKeywordControllerRemove(id)
      refetchKeywordsEng()
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeywordChn = async () => {
    const keywordDataChn: CreateSearchKeywordDto = {
      keyword: keywordChn,
      order: 0,
      languageLocale: "zh",
    }
    try {
      setLoading(true)
      await searchKeywordControllerCreate(keywordDataChn)
      setKeywordsChn([...keywordsChn, keywordChn])
      setKeywordChn("")
      refetchKeywordsChn()
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKeywordChn = async (id: string) => {
    try {
      setLoading(true)
      await searchKeywordControllerRemove(id)
      refetchKeywordsChn()
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeywordChnTW = async () => {
    const keywordDataChnTW: CreateSearchKeywordDto = {
      keyword: keywordChnTW,
      order: 0,
      languageLocale: "zh-TW",
    }
    try {
      setLoading(true)
      await searchKeywordControllerCreate(keywordDataChnTW)
      setKeywordsChnTW([...keywordsChn, keywordChn])
      setKeywordChnTW("")
      refetchKeywordsChnTW()
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKeywordChnTW = async (id: string) => {
    try {
      setLoading(true)
      await searchKeywordControllerRemove(id)
      refetchKeywordsChnTW()
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeywordJpn = async () => {
    const keywordDataJpn: CreateSearchKeywordDto = {
      keyword: keywordJpn,
      order: 0,
      languageLocale: "ja",
    }
    try {
      setLoading(true)
      await searchKeywordControllerCreate(keywordDataJpn)
      setKeywordsJpn([...keywordsJpn, keywordJpn])
      setKeywordJpn("")
      refetchKeywordsJpn()
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKeywordJpn = async (id: string) => {
    try {
      setLoading(true)
      await searchKeywordControllerRemove(id)
      refetchKeywordsJpn()
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeywordTha = async () => {
    const keywordDataTha: CreateSearchKeywordDto = {
      keyword: keywordTha,
      order: 0,
      languageLocale: "th",
    }
    try {
      setLoading(true)
      await searchKeywordControllerCreate(keywordDataTha)
      setKeywordsTha([...keywordsTha, keywordTha])
      setKeywordTha("")
      refetchKeywordsTha()
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKeywordTha = async (id: string) => {
    try {
      setLoading(true)
      await searchKeywordControllerRemove(id)
      refetchKeywordsTha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h2">메인 검색 키워드 관리</Typography>
      <Paper sx={{ width: "100%", p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          추천할 한국어 검색 키워드를 추가하세요
        </Typography>
        {/* Text input field for adding keywords */}
        <TextField
          label="추가할 키워드"
          value={keywordKor}
          onChange={(e) => setKeywordKor(e.target.value)}
          sx={{ width: "500px", mr: 2 }}
          disabled={loading}
        />

        {/* Add button */}
        <Button onClick={handleAddKeywordKor} disabled={loading}>
          추가
        </Button>

        {/* Display added keywords as chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
          {keywordsKor.map((kw, index) => (
            <Chip
              key={index}
              label={kw}
              sx={{ mr: 1, mb: 1, cursor: "pointer" }}
              onDelete={() => {
                const keywordItem = keywordsListKor?.items?.[index]
                if (keywordItem) {
                  handleDeleteKeywordKor(keywordItem.id)
                }
              }}
              disabled={loading}
            />
          ))}
        </Box>
      </Paper>
      <Paper sx={{ width: "100%", p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          추천할 영어 검색 키워드를 추가하세요
        </Typography>
        {/* Text input field for adding keywords */}
        <TextField
          label="추가할 키워드"
          value={keywordEng}
          onChange={(e) => setKeywordEng(e.target.value)}
          sx={{ width: "500px", mr: 2 }}
          disabled={loading}
        />

        {/* Add button */}
        <Button onClick={handleAddKeywordEng} disabled={loading}>
          추가
        </Button>

        {/* Display added keywords as chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
          {keywordsEng.map((kw, index) => (
            <Chip
              key={index}
              label={kw}
              sx={{ mr: 1, mb: 1, cursor: "pointer" }}
              onDelete={() => {
                const keywordItem = keywordsListEng?.items?.[index]
                if (keywordItem) {
                  handleDeleteKeywordEng(keywordItem.id)
                }
              }}
              disabled={loading}
            />
          ))}
        </Box>
      </Paper>
      <Paper sx={{ width: "100%", p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          추천할 중국어 간체 검색 키워드를 추가하세요
        </Typography>
        {/* Text input field for adding keywords */}
        <TextField
          label="추가할 키워드"
          value={keywordChn}
          onChange={(e) => setKeywordChn(e.target.value)}
          sx={{ width: "500px", mr: 2 }}
          disabled={loading}
        />

        {/* Add button */}
        <Button onClick={handleAddKeywordChn} disabled={loading}>
          추가
        </Button>

        {/* Display added keywords as chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
          {keywordsChn.map((kw, index) => (
            <Chip
              key={index}
              label={kw}
              sx={{ mr: 1, mb: 1, cursor: "pointer" }}
              onDelete={() => {
                const keywordItem = keywordsListChn?.items?.[index]
                if (keywordItem) {
                  handleDeleteKeywordChn(keywordItem.id)
                }
              }}
              disabled={loading}
            />
          ))}
        </Box>
      </Paper>
      <Paper sx={{ width: "100%", p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          추천할 중국어 번체 검색 키워드를 추가하세요
        </Typography>
        {/* Text input field for adding keywords */}
        <TextField
          label="추가할 키워드"
          value={keywordChnTW}
          onChange={(e) => setKeywordChnTW(e.target.value)}
          sx={{ width: "500px", mr: 2 }}
          disabled={loading}
        />

        {/* Add button */}
        <Button onClick={handleAddKeywordChnTW} disabled={loading}>
          추가
        </Button>

        {/* Display added keywords as chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
          {keywordsChnTW.map((kw, index) => (
            <Chip
              key={index}
              label={kw}
              sx={{ mr: 1, mb: 1, cursor: "pointer" }}
              onDelete={() => {
                const keywordItem = keywordsListChnTW?.items?.[index]
                if (keywordItem) {
                  handleDeleteKeywordChnTW(keywordItem.id)
                }
              }}
              disabled={loading}
            />
          ))}
        </Box>
      </Paper>
      <Paper sx={{ width: "100%", p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          추천할 일본어 검색 키워드를 추가하세요
        </Typography>
        {/* Text input field for adding keywords */}
        <TextField
          label="추가할 키워드"
          value={keywordJpn}
          onChange={(e) => setKeywordJpn(e.target.value)}
          sx={{ width: "500px", mr: 2 }}
          disabled={loading}
        />

        {/* Add button */}
        <Button onClick={handleAddKeywordJpn} disabled={loading}>
          추가
        </Button>

        {/* Display added keywords as chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
          {keywordsJpn.map((kw, index) => (
            <Chip
              key={index}
              label={kw}
              sx={{ mr: 1, mb: 1, cursor: "pointer" }}
              onDelete={() => {
                const keywordItem = keywordsListJpn?.items?.[index]
                if (keywordItem) {
                  handleDeleteKeywordJpn(keywordItem.id)
                }
              }}
              disabled={loading}
            />
          ))}
        </Box>
      </Paper>
      <Paper sx={{ width: "100%", p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          추천할 태국어 검색 키워드를 추가하세요
        </Typography>
        {/* Text input field for adding keywords */}
        <TextField
          label="추가할 키워드"
          value={keywordTha}
          onChange={(e) => setKeywordTha(e.target.value)}
          sx={{ width: "500px", mr: 2 }}
          disabled={loading}
        />

        {/* Add button */}
        <Button onClick={handleAddKeywordTha} disabled={loading}>
          추가
        </Button>

        {/* Display added keywords as chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
          {keywordsTha.map((kw, index) => (
            <Chip
              key={index}
              label={kw}
              sx={{ mr: 1, mb: 1, cursor: "pointer" }}
              onDelete={() => {
                const keywordItem = keywordsListTha?.items?.[index]
                if (keywordItem) {
                  handleDeleteKeywordTha(keywordItem.id)
                }
              }}
              disabled={loading}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}

export default KeywordsList
