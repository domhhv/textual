const plainText = `The art of writing is the art of discovering what you believe. Every sentence you construct becomes a small act of faith—a commitment to an idea, an argument, or a feeling. When you sit down to write, you're not merely transcribing thoughts that already exist fully formed in your mind. Instead, you're engaged in a process of exploration, uncovering connections and insights that emerge only through the discipline of putting words on a page.

Good writing requires patience. It demands that you resist the urge to rush toward conclusions before you've properly examined your premises. The best writers understand that clarity doesn't come from simplification alone—it comes from thinking deeply enough about a subject that complexity becomes comprehensible. They know that every paragraph should earn its place, every sentence should serve a purpose, and every word should carry its weight.

Consider how you approach your own writing. Do you begin with an outline, mapping the terrain before you venture into it? Or do you prefer to discover your argument as you go, letting the act of writing itself reveal what you truly think? Neither approach is inherently superior. What matters is developing a practice that allows you to engage honestly with your ideas and communicate them effectively to others.

The reader is always present, even when you write alone. Their attention is a gift you must respect. This means being clear without being condescending, being thorough without being tedious, and being confident without being arrogant. It means anticipating questions and addressing them, acknowledging counterarguments and responding to them, and ultimately guiding your reader toward understanding rather than demanding they arrive there on their own.

Writing well is difficult. It will always be difficult. But the difficulty is what makes it worthwhile.`;

const formattedText = `# Mastering Text Formatting

Effective writing uses formatting to enhance clarity and emphasize key points. Here's how different formatting styles serve distinct purposes.

## Bold for Emphasis

Use **bold text** when you want to draw immediate attention to important terms or concepts. For example: "The **deadline** is tomorrow" or "Remember the **three key principles** we discussed."

Bold text creates visual anchors that help readers scan and navigate your content efficiently. Use it sparingly—**when everything is emphasized, nothing is**.

## Italic for Nuance

_Italic text_ serves several purposes. Use it for:

- Introducing _new terminology_ for the first time
- _Titles of books_, articles, or other works
- Adding _subtle emphasis_ that doesn't demand attention like bold
- Representing _internal thoughts_ or _foreign phrases_

Notice how _italics_ whisper while **bold** shouts. Choose accordingly.

## Combining Styles

Sometimes you need both: **_this combination_** suggests something is both important and deserves special attention. Use this rarely—it's the typographic equivalent of underlining something you've already highlighted.

## Strikethrough for Revision

~~Strikethrough~~ shows what's been removed or changed. It's useful for:

- Showing ~~wrong information~~ corrections in collaborative editing
- Creating a ~~formal~~ casual tone
- Demonstrating ~~complex~~ simple alternatives

## Inline Code

When discussing technical topics, use \`inline code\` for variable names like \`userName\`, function calls like \`calculateTotal()\`, or file paths like \`/src/components/\`. This distinguishes code from regular prose and makes it easier to identify technical terms.

## Putting It All Together

Good formatting is **invisible**—it guides the reader without calling attention to itself. When you _emphasize_ something, make sure it deserves that emphasis. When you use \`code formatting\`, ensure it clarifies rather than confuses. And when you ~~cross something out~~, consider whether that revision truly adds value to your document.`;

const headings = `# Heading Level 1: The Main Title

The first-level heading represents the primary topic of your document. Use it sparingly—typically just once at the very top. It establishes the scope and subject of everything that follows.

## Heading Level 2: Major Sections

Second-level headings divide your document into major thematic sections. Think of these as chapters in a book. Each H2 should represent a distinct subtopic that contributes to the overall narrative.

### Heading Level 3: Subsections

Third-level headings break down your major sections into more specific topics. They help readers navigate complex sections and find exactly what they're looking for.

#### Heading Level 4: Detailed Points

Fourth-level headings are useful for organizing detailed discussions within subsections. They're common in technical documentation where precision matters.

##### Heading Level 5: Fine-Grained Organization

Fifth-level headings provide additional granularity. At this depth, consider whether your content might benefit from a different organizational structure, such as lists or tables.

###### Heading Level 6: Maximum Depth

The sixth and final heading level. If you find yourself needing more levels than this, it's usually a sign that your document structure needs rethinking.

---

## Best Practices for Heading Hierarchy

### Maintain Logical Order

Never skip heading levels. Going from H2 directly to H4 confuses readers and breaks the document's logical structure.

### Keep Headings Concise

A good heading is like a signpost—it tells readers where they are and what to expect without requiring a paragraph of explanation.

### Use Parallel Structure

When headings are at the same level, try to maintain grammatical consistency. If one H3 is a question, consider making related H3s questions too.`;

const lists = `# Working with Lists

Lists are essential for organizing information clearly. Each type serves a different purpose.

## Bullet Lists

Use bullet lists when the order of items doesn't matter:

- Apples
- Oranges
- Bananas
- Grapes
- Strawberries

Nested bullets help show relationships:

- Fruits
  - Citrus
    - Oranges
    - Lemons
    - Limes
  - Berries
    - Strawberries
    - Blueberries
  - Stone fruits
    - Peaches
    - Plums
- Vegetables
  - Leafy greens
  - Root vegetables

## Numbered Lists

Use numbered lists when sequence matters:

1. Preheat your oven to 350°F
2. Mix the dry ingredients in a large bowl
3. Add wet ingredients and stir until combined
4. Pour batter into prepared pan
5. Bake for 25-30 minutes
6. Let cool before serving

Nested numbered lists work for complex procedures:

1. Planning phase
    1. Define project scope
    2. Identify stakeholders
    3. Create timeline
2. Execution phase
    1. Assign tasks
    2. Monitor progress
    3. Address blockers
3. Review phase
  1. Gather feedback
  2. Document lessons learned
  3. Celebrate success

## Checklists

Use checklists for tracking tasks and progress:

- [x] Research topic thoroughly
- [x] Create outline
- [x] Write first draft
- [ ] Review and edit
- [ ] Get feedback from peers
- [ ] Make final revisions
- [ ] Publish

Checklists are perfect for:

- [ ] Daily task management
- [ ] Project milestones
- [ ] Quality assurance processes
- [x] Shopping lists
- [x] Meeting agendas

## Combining List Types

Sometimes you need different list types together:

**Project Requirements:**

1. Must-have features:
   - User authentication
   - Data export functionality
   - [x] Responsive design
   - [ ] Dark mode support

2. Nice-to-have features:
   - Social media integration
   - Advanced analytics
   - [ ] Custom themes`;

const quotesCodeMath = `# Quotes, Code, and Mathematical Notation

## Blockquotes

Blockquotes are perfect for citations, testimonials, and highlighting important passages:

> The only way to do great work is to love what you do.
> — Steve Jobs

Blockquotes can span multiple paragraphs:

> In the beginning, the Universe was created.
> 
> This has made a lot of people very angry and been widely regarded as a bad move.
> 
> — Douglas Adams, The Restaurant at the End of the Universe

Nested quotes for conversations or nested citations:

## Code Blocks

For longer code snippets, use fenced code blocks with language specification:

\`\`\`python
def fibonacci(n):
    """Generate the first n Fibonacci numbers."""
    sequence = []
    a, b = 0, 1
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

# Generate first 10 numbers
print(fibonacci(10))
\`\`\`

Another example in JavaScript:

\`\`\`javascript
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};
\`\`\`

SQL queries also benefit from syntax highlighting:

\`\`\`sql
SELECT
  users.name,
  COUNT(orders.id) as order_count,
  SUM(orders.total) as total_spent
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE orders.created_at >= '2024-01-01'
GROUP BY users.id
HAVING order_count > 5
ORDER BY total_spent DESC;
\`\`\`

## Mathematical Notation

For mathematical expressions, we use subscript and superscript notation.

### Superscript (Exponents)

Einstein's famous equation: E = mc^2^

The area of a circle: A = πr^2^

Quadratic formula components: ax^2^ + bx + c = 0

### Subscript (Indices)

Chemical formulas: H~2~O (water), CO~2~ (carbon dioxide), C~6~H~12~O~6~ (glucose)

Sequences: a~1~, a~2~, a~3~, ..., a~n~

Variables with indices: x~i~ represents the i^th^ element

### Combining Both

The general term of a sequence: a~n~ = a~1~ × r^n-1^

Logarithmic notation: log~2~(8) = 3 because 2^3^ = 8

Chemical equations with states: 2H~2~(g) + O~2~(g) → 2H~2~O(l)`;

const tables = `# Tables for Data Presentation

Tables organize information into rows and columns, making complex data easy to compare and understand.

## Basic Table

| Name | Role | Department |
|------|------|------------|
| Alice | Engineer | Development |
| Bob | Designer | Creative |
| Carol | Manager | Operations |
| David | Analyst | Finance |

## Data Comparison Table

| Feature | Basic Plan | Pro Plan | Enterprise |
|---------|:----------:|:--------:|:----------:|
| Users | 1 | 10 | Unlimited |
| Storage | 5 GB | 100 GB | 1 TB |
| Support | Email | Priority | Dedicated |
| API Access | ❌ | ✅ | ✅ |
| Custom Domain | ❌ | ✅ | ✅ |
| Analytics | Basic | Advanced | Custom |
| Price/month | $0 | $29 | $199 |

## Schedule Table

| Time | Monday | Tuesday | Wednesday | Thursday | Friday |
|------|--------|---------|-----------|----------|--------|
| 9:00 | Standup | Standup | Standup | Standup | Standup |
| 10:00 | Development | Design Review | Development | Development | Sprint Planning |
| 12:00 | Lunch | Lunch | Lunch | Lunch | Lunch |
| 13:00 | Development | Development | Team Meeting | Development | Development |
| 15:00 | Code Review | Development | Development | Demo | Retrospective |
| 17:00 | Wrap-up | Wrap-up | Wrap-up | Wrap-up | Week Review |

## Technical Specifications

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`width\` | number | 100 | Container width in pixels |
| \`height\` | number | auto | Container height |
| \`className\` | string | "" | Additional CSS classes |
| \`disabled\` | boolean | false | Disables interaction |
| \`onChange\` | function | null | Callback on value change |

## Comparison Matrix

| Criteria | Option A | Option B | Option C |
|----------|:--------:|:--------:|:--------:|
| Cost | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| Quality | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Speed | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| Support | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| **Total** | **9** | **9** | **8** |`;

const everything = `# Welcome to Textual: The Complete Guide

**Textual** is a _powerful_ AI-assisted rich text editor that combines the elegance of Lexical with the intelligence of OpenAI's GPT. This document showcases every formatting feature available.

---

## Text Formatting Showcase

Master the art of emphasis with our comprehensive formatting tools:

- **Bold text** demands attention and highlights key concepts
- _Italic text_ adds nuance, titles, and subtle emphasis
- **_Bold italic_** for maximum impact on critical points
- ~~Strikethrough~~ shows revisions and removed content
- \`Inline code\` for technical terms like \`useState()\` or \`npm install\`

Combine them freely: **This is _really_ important**, or check out the \`config.ts\` file for ~~old~~ **new** settings.

---

## Heading Hierarchy

### Third Level: Major Subsections

#### Fourth Level: Detailed Topics

##### Fifth Level: Fine-Grained Points

###### Sixth Level: Maximum Depth

Each level serves a purpose in organizing your content logically.

---

## Lists of Every Kind

### Bullet Lists

Essential items for productive writing:

- A clear purpose
- Well-organized thoughts
- Supporting evidence
  - Research data
  - Expert quotes
  - Real-world examples
- Strong conclusions

### Numbered Lists

Follow these steps for great documentation:

1. Start with an outline
2. Write your first draft
3. Review and revise
   1. Check for clarity
   2. Verify accuracy
   3. Polish the prose
4. Get feedback
5. Publish with confidence

### Task Checklists

Track your progress on this tutorial:

- [x] Learned about text formatting
- [x] Explored heading levels
- [x] Mastered list types
- [ ] Practiced with blockquotes
- [ ] Created tables
- [ ] Tried code blocks
- [ ] Experimented with math notation

---

## Blockquotes and Citations

> The best way to predict the future is to create it.
> — Peter Drucker

> Success usually comes to those who are too busy to be looking for it.
> — Henry David Thoreau

> Innovation distinguishes between a leader and a follower.
> 
> — Steve Jobs

---

## Code Examples

### JavaScript Function

\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('User not found');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}
\`\`\`

### Python Class

\`\`\`python
class TextEditor:
    def __init__(self, content=""):
        self.content = content
        self.history = []

    def insert(self, text, position=None):
        self.history.append(self.content)
        if position is None:
            self.content += text
        else:
            self.content = self.content[:position] + text + self.content[position:]

    def undo(self):
        if self.history:
            self.content = self.history.pop()
\`\`\`

### SQL Query

\`\`\`sql
SELECT
  documents.title,
  users.name AS author,
  COUNT(edits.id) AS edit_count
FROM documents
INNER JOIN users ON documents.author_id = users.id
LEFT JOIN edits ON documents.id = edits.document_id
WHERE documents.created_at > '2024-01-01'
GROUP BY documents.id
ORDER BY edit_count DESC
LIMIT 10;
\`\`\`

---

## Mathematical Notation

### Scientific Formulas

- Einstein's equation: E = mc^2^
- Pythagorean theorem: a^2^ + b^2^ = c^2^
- Compound interest: A = P(1 + r)^n^

### Chemical Formulas

- Water: H~2~O
- Carbon dioxide: CO~2~
- Glucose: C~6~H~12~O~6~
- Sulfuric acid: H~2~SO~4~

### Combined Notation

- pH calculation: pH = -log~10~[H^+^]
- Quadratic: x = (-b ± √(b^2 - 4ac)) / 2a
- Exponential decay: N~t~ = N~0~ × e^-λt

---

## Data Tables

### Feature Comparison

| Feature | Free | Pro | Enterprise |
|---------|:----:|:---:|:----------:|
| Documents | 3 | 50 | Unlimited |
| AI Requests | 10/day | 100/day | Unlimited |
| Collaboration | ❌ | ✅ | ✅ |
| Export Options | PDF | All formats | All + API |
| Support | Community | Email | Dedicated |
| Price | $0 | $19/mo | Contact us |

### Project Status

| Task | Owner | Status | Priority | Due Date |
|------|-------|:------:|:--------:|----------|
| Design system | Alice | ✅ Done | High | Jan 15 |
| API endpoints | Bob | 🔄 In Progress | High | Jan 20 |
| Documentation | Carol | 📋 Planned | Medium | Jan 25 |
| Testing | David | ⏳ Blocked | High | Jan 22 |

### Technical Specifications

| Property | Type | Default | Required | Description |
|----------|------|---------|:--------:|-------------|
| \`content\` | string | "" | ✅ | Initial document content |
| \`onChange\` | function | - | ❌ | Callback on content change |
| \`readOnly\` | boolean | false | ❌ | Disable editing |
| \`theme\` | "light" \\| "dark" | "light" | ❌ | Color scheme |

---

## Putting It All Together

This document demonstrates how different formatting elements work together to create **clear**, _engaging_, and well-structured content. Whether you're writing:

1. Technical documentation with \`code samples\`
2. Scientific papers with formulas like E = mc^2^ and H~2~O
3. Project plans with task lists and status tables
4. Creative content with quotes and emphasis

> Textual adapts to your needs, combining the power of AI with intuitive formatting tools.

### Quick Reference

| Format | Syntax | Result |
|--------|--------|--------|
| Bold | \`**text**\` | **text** |
| Italic | \`_text_\` | _text_ |
| Code | \`\\\`code\\\`\` | \`code\` |
| Superscript | \`x^2^\` | x^2^ |
| Subscript | \`H~2~O\` | H~2~O |

---

**Ready to create something amazing?** Start typing, use the AI assistant, and let your ideas flow! ✨`;

const editorSampleContents = [
  { content: plainText, key: 'plainText', label: 'Plain Text' },
  { content: formattedText, key: 'formattedText', label: 'Formatted Text' },
  { content: headings, key: 'headings', label: 'Headings' },
  { content: lists, key: 'lists', label: 'Lists' },
  { content: quotesCodeMath, key: 'quotesCodeMath', label: 'Quotes & Code' },
  { content: tables, key: 'tables', label: 'Tables' },
  { content: everything, key: 'everything', label: 'Show Me Everything!' },
] as const;

export type SampleContentKey = (typeof editorSampleContents)[number]['key'];

export default editorSampleContents;
