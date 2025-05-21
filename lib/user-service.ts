// User service to handle user data operations
interface User {
  email: string
  name: string
  password: string
  balance: number
  status: string
  joined: string
  transactions?: Transaction[]
  investments?: Investment[]
  isVerified?: boolean
}

interface Transaction {
  id: string
  type: "deposit" | "withdrawal"
  amount: number
  currency: string
  status: "pending" | "completed" | "rejected"
  date: string
  method: string
  userEmail?: string
  userName?: string
}

interface Investment {
  id: string
  plan: string
  amount: number
  profit: number
  duration: string
  startDate: string
  endDate: string
  status: "active" | "completed"
  userEmail?: string
  userName?: string
}

interface Verification {
  id: string
  userEmail: string
  userName: string
  documentType: string
  documentNumber?: string
  country?: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  approvedDate?: string
  rejectedDate?: string
  frontImage?: string
  backImage?: string
  selfieImage?: string
  adminNotes?: string
}

// Get all registered users
export function getRegisteredUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  } catch (error) {
    console.error("Error getting registered users:", error)
    return []
  }
}

// Get user by email
export function getUserByEmail(email: string): User | null {
  const users = getRegisteredUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
}

// Save user data
export function saveUser(user: User): void {
  try {
    const users = getRegisteredUsers()
    const existingUserIndex = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase())

    if (existingUserIndex >= 0) {
      // Update existing user
      users[existingUserIndex] = { ...users[existingUserIndex], ...user }
    } else {
      // Add new user
      users.push(user)
    }

    localStorage.setItem("registeredUsers", JSON.stringify(users))
  } catch (error) {
    console.error("Error saving user:", error)
  }
}

// Update user balance
export function updateUserBalance(email: string, amount: number): void {
  try {
    const users = getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex >= 0) {
      users[userIndex].balance = (users[userIndex].balance || 0) + amount
      localStorage.setItem("registeredUsers", JSON.stringify(users))

      // Also update current user if it's the logged in user
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (currentUser.email?.toLowerCase() === email.toLowerCase()) {
        currentUser.balance = users[userIndex].balance
        localStorage.setItem("user", JSON.stringify(currentUser))
      }
    }
  } catch (error) {
    console.error("Error updating user balance:", error)
  }
}

// Add transaction to user
export function addTransaction(email: string, transaction: Transaction): void {
  try {
    const users = getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex >= 0) {
      if (!users[userIndex].transactions) {
        users[userIndex].transactions = []
      }

      users[userIndex].transactions.push(transaction)
      localStorage.setItem("registeredUsers", JSON.stringify(users))
    }
  } catch (error) {
    console.error("Error adding transaction:", error)
  }
}

// Add investment to user
export function addInvestment(email: string, investment: Investment): void {
  try {
    const users = getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex >= 0) {
      if (!users[userIndex].investments) {
        users[userIndex].investments = []
      }

      users[userIndex].investments.push(investment)
      localStorage.setItem("registeredUsers", JSON.stringify(users))
    }
  } catch (error) {
    console.error("Error adding investment:", error)
  }
}

// Get user transactions
export function getUserTransactions(email: string): Transaction[] {
  const user = getUserByEmail(email)
  return user?.transactions || []
}

// Get user investments
export function getUserInvestments(email: string): Investment[] {
  const user = getUserByEmail(email)
  return user?.investments || []
}

// Update user status
export function updateUserStatus(email: string, status: string): void {
  try {
    const users = getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex >= 0) {
      users[userIndex].status = status
      localStorage.setItem("registeredUsers", JSON.stringify(users))
    }
  } catch (error) {
    console.error("Error updating user status:", error)
  }
}

// Get all transactions
export function getAllTransactions(): Transaction[] {
  try {
    const users = getRegisteredUsers()
    let allTransactions: Transaction[] = []

    users.forEach((user) => {
      if (user.transactions && user.transactions.length > 0) {
        // Add user email to each transaction for reference
        const userTransactions = user.transactions.map((t) => ({
          ...t,
          userEmail: user.email,
          userName: user.name,
        }))
        allTransactions = [...allTransactions, ...userTransactions]
      }
    })

    // Sort by date, newest first
    return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error getting all transactions:", error)
    return []
  }
}

// Get all investments
export function getAllInvestments(): Investment[] {
  try {
    const users = getRegisteredUsers()
    let allInvestments: Investment[] = []

    users.forEach((user) => {
      if (user.investments && user.investments.length > 0) {
        // Add user email to each investment for reference
        const userInvestments = user.investments.map((i) => ({
          ...i,
          userEmail: user.email,
          userName: user.name,
        }))
        allInvestments = [...allInvestments, ...userInvestments]
      }
    })

    // Sort by date, newest first
    return allInvestments.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  } catch (error) {
    console.error("Error getting all investments:", error)
    return []
  }
}

// Update transaction status
export function updateTransactionStatus(userEmail: string, transactionId: string, status: string): void {
  try {
    const users = getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === userEmail.toLowerCase())

    if (userIndex >= 0 && users[userIndex].transactions) {
      const transactionIndex = users[userIndex].transactions.findIndex((t) => t.id === transactionId)

      if (transactionIndex >= 0) {
        users[userIndex].transactions[transactionIndex].status = status
        localStorage.setItem("registeredUsers", JSON.stringify(users))
      }
    }
  } catch (error) {
    console.error("Error updating transaction status:", error)
  }
}

// Add profit to user
export function addProfitToUser(email: string, amount: number): void {
  try {
    const users = getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex >= 0) {
      // Add profit to balance
      users[userIndex].balance = (users[userIndex].balance || 0) + amount

      // Add a profit transaction
      if (!users[userIndex].transactions) {
        users[userIndex].transactions = []
      }

      const profitTransaction: Transaction = {
        id: `profit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: "deposit",
        amount: amount,
        currency: "USD",
        status: "completed",
        date: new Date().toISOString().split("T")[0],
        method: "Profit",
      }

      users[userIndex].transactions.push(profitTransaction)
      localStorage.setItem("registeredUsers", JSON.stringify(users))

      // Update current user if it's the logged in user
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (currentUser.email?.toLowerCase() === email.toLowerCase()) {
        currentUser.balance = users[userIndex].balance
        localStorage.setItem("user", JSON.stringify(currentUser))
      }
    }
  } catch (error) {
    console.error("Error adding profit to user:", error)
  }
}

// Deduct from user balance
export function deductFromUserBalance(email: string, amount: number): void {
  try {
    const users = getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex >= 0) {
      // Deduct from balance
      users[userIndex].balance = Math.max(0, (users[userIndex].balance || 0) - amount)

      // Add a deduction transaction
      if (!users[userIndex].transactions) {
        users[userIndex].transactions = []
      }

      const deductionTransaction: Transaction = {
        id: `deduct-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: "withdrawal",
        amount: amount,
        currency: "USD",
        status: "completed",
        date: new Date().toISOString().split("T")[0],
        method: "Admin Deduction",
      }

      users[userIndex].transactions.push(deductionTransaction)
      localStorage.setItem("registeredUsers", JSON.stringify(users))

      // Update current user if it's the logged in user
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (currentUser.email?.toLowerCase() === email.toLowerCase()) {
        currentUser.balance = users[userIndex].balance
        localStorage.setItem("user", JSON.stringify(currentUser))
      }
    }
  } catch (error) {
    console.error("Error deducting from user balance:", error)
  }
}

// Get all verification requests
export function getUserVerifications(): Verification[] {
  try {
    return JSON.parse(localStorage.getItem("userVerifications") || "[]")
  } catch (error) {
    console.error("Error getting user verifications:", error)
    return []
  }
}

// Get verification by ID
export function getVerificationById(id: string): Verification | null {
  const verifications = getUserVerifications()
  return verifications.find((v) => v.id === id) || null
}

// Add verification request
export function addVerificationRequest(verification: Verification): void {
  try {
    const verifications = getUserVerifications()
    verifications.push(verification)
    localStorage.setItem("userVerifications", JSON.stringify(verifications))
  } catch (error) {
    console.error("Error adding verification request:", error)
  }
}

// Update verification status
export function updateVerificationStatus(id: string, status: string): void {
  try {
    const verifications = getUserVerifications()
    const verificationIndex = verifications.findIndex((v) => v.id === id)

    if (verificationIndex >= 0) {
      verifications[verificationIndex].status = status

      // Add timestamp for approval or rejection
      if (status === "approved") {
        verifications[verificationIndex].approvedDate = new Date().toISOString().split("T")[0]

        // Update user's verification status
        const userEmail = verifications[verificationIndex].userEmail
        if (userEmail) {
          const users = getRegisteredUsers()
          const userIndex = users.findIndex((u) => u.email.toLowerCase() === userEmail.toLowerCase())
          if (userIndex >= 0) {
            users[userIndex].isVerified = true
            localStorage.setItem("registeredUsers", JSON.stringify(users))
          }
        }
      } else if (status === "rejected") {
        verifications[verificationIndex].rejectedDate = new Date().toISOString().split("T")[0]
      }

      localStorage.setItem("userVerifications", JSON.stringify(verifications))
    }
  } catch (error) {
    console.error("Error updating verification status:", error)
  }
}

// Update verification notes
export function updateVerificationNotes(id: string, notes: string): void {
  try {
    const verifications = getUserVerifications()
    const verificationIndex = verifications.findIndex((v) => v.id === id)

    if (verificationIndex >= 0) {
      verifications[verificationIndex].adminNotes = notes
      localStorage.setItem("userVerifications", JSON.stringify(verifications))
    }
  } catch (error) {
    console.error("Error updating verification notes:", error)
  }
}

// Submit user verification request
export function submitVerification(
  userEmail: string,
  userName: string,
  verificationData: {
    documentType: string
    documentNumber?: string
    country?: string
    frontImage?: string
    backImage?: string
    selfieImage?: string
  },
): string {
  try {
    const verificationId = `verification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    const verification: Verification = {
      id: verificationId,
      userEmail,
      userName,
      documentType: verificationData.documentType,
      documentNumber: verificationData.documentNumber,
      country: verificationData.country,
      frontImage: verificationData.frontImage,
      backImage: verificationData.backImage,
      selfieImage: verificationData.selfieImage,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "pending",
    }

    addVerificationRequest(verification)
    return verificationId
  } catch (error) {
    console.error("Error submitting verification:", error)
    throw new Error("Failed to submit verification")
  }
}
