# ---
# REPORTLAB
# ---

# ---
# dependencies and install
# ---

# pillow
# reportlab

# ---
# imports
# ---

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib.colors import Color, black, white, gray, red, blue, green, yellow
# platypus
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Frame, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.rl_config import defaultPageSize

# platypus
PAGE_WIDTH = defaultPageSize[0]
PAGE_HEIGHT = defaultPageSize[1]
styles = getSampleStyleSheet()

# ---
# canvas object
# ---

# origin (0,0) is bottom left corner
    # in tkinter and wxPython, it is top left
# if page size isn't specified, reportlab defaults to ReportLab config (usually A4)
    # common page sizes can be found in reportlb.lib.pagesizes
    # page size is measured in points (1/72 of an inch)
# canvas.showPage() -- ends page. saves page. 
    # further drawing will be on another page
    # state changes forgotten (font, color, geometry transforms, etc)
# overlapping objects -- earlier objects are under, later objects are over??


c = canvas.Canvas("hello.pdf") # instantiate canvas object (args: filename or path)
c.drawString(100,100, 'Welcome to Reportlab!') # draw string (100 right, 100 up)
c.showPage() # save current page of canvas, also ends current page
c.save() # save documents to disk

# ---
# canvas object (in-depth)
# ---

# example of instantiation with arguments
c = canvas.Canvas(
    filename='hello.pdf', 
    pagesize=letter, # tuple of width/height in points (or import from reportlab.lib.pagesizes)
    bottomup=1, # 0 -- changes origin to top left
    pageCompression=None, 
    invariant=None, 
    verbosity=None, # confirmation message printed every time a PDF is created
    encrypt=None, # if a string is passed, PDF is encrypted and string is password
    cropMarks=None, 
    pdfVersion=None, 
    enforceColorSpace=None
)
# save w, h for later
width, height = letter
# set font
fonts = c.getAvailableFonts() # get fonts from local system
c.setFont(psfontname=fonts[0], size=12) # use first font in fonts
# draw
x = int(width/2)
y = int(height/2)
c.drawCentredString(x=x, y=y, text='hello')
# save
c.showPage()
c.save()
    

# ---
# drawing operations
# ---

c.translate(inch, inch) # move origin up/right

# line methods
canvas.line(x1,y1,x2,y2)
canvas.lines(linelist)

# shape methods
canvas.grid(xlist, ylist) 
canvas.bezier(x1, y1, x2, y2, x3, y3, x4, y4)
canvas.arc(x1,y1,x2,y2) 
canvas.rect(x, y, width, height, stroke=1, fill=0) 
canvas.ellipse(x1,y1, x2,y2, stroke=1, fill=0)
canvas.wedge(x1,y1, x2,y2, startAng, extent, stroke=1, fill=0) 
canvas.circle(x_cen, y_cen, r, stroke=1, fill=0)
canvas.roundRect(x, y, width, height, radius, stroke=1, fill=0) 

# string methods
canvas.drawString(x, y, text)
canvas.drawRightString(x, y, text)
canvas.drawCentredString(x, y, text)

# image methods
canvas.drawInlineImage(self, image, x,y, width=None,height=None) # inefficient
canvas.drawImage(self, image, x,y, width=None,height=None,mask=None) # use this one

# text object methods
    # skipped
# path object methods
    # skipped

# ---
# state change operations
# ---

# colors
Changing Colorscanvas.setFillColorCMYK(c, m, y, k) 
canvas.setStrikeColorCMYK(c, m, y, k) 
canvas.setFillColorRGB(r, g, b) # (0,0,0) black (1,1,1) white
canvas.setStrokeColorRGB(r, g, b) # (0,0,0) black (1,1,1) white
canvas.setFillColor(acolor) 
canvas.setStrokeColor(acolor) 
canvas.setFillGray(gray)
canvas.setStrokeGray(gray) 

# create color (with transparency)
color1 = Color(1,1,1, alpha=0.5) # transparent white
c.setFillColor(color1) # use transparent white

# fonts
canvas.setFont(psfontname, size, leading = None) 

# graphical line styles
canvas.setLineWidth(width) 
canvas.setLineCap(mode) 
canvas.setLineJoin(mode) 
canvas.setMiterLimit(limit) 
canvas.setDash(self, array=[], phase=0) 

# geometry
canvas.setPageSize(pair) 
canvas.transform(a,b,c,d,e,f) 
canvas.translate(dx, dy) 
canvas.scale(x, y) 
canvas.rotate(theta)
canvas.skew(alpha, beta)


# ---
# text object methods
# ---

# skipped

# ---
# path & line object methods
# ---

# skipped

# ---
# platypus -- page layout and typography using scripts
# ---

# layers of PLATYPUS:
    # DocTemplates -- outermost container for the document
    # PageTemplates -- specifications for layouts of pages of various kinds
    # Frames -- specifications of regions in pages that can contain flowing text/graphics
        # tables, paragraphs, images
    # Flowables -- text or graphic elements that should be 'flowed into the document'
    # pdfgen.Canvas -- lowest level (receives he painting of the doc from other layers)

# to use PLATYPUS:
    # create a document from a DocTemplate class
    # pass a list of flowables to its 'build' method


# ---
# platypus example
# ---

title = 'Hello world'
pageinfo = 'platypus example'
def firstPage(canvas, doc):
    canvas.saveState()
    # title
    canvas.setFont('Times-Bold',16)
    x1 = PAGE_WIDTH/2.0
    y1 = PAGE_HEIGHT - 108
    canvas.drawCentredString(x1, y1, title)
    # text
    canvas.setFont('Times-Roman',9)
    x2 = inch
    y2 = 0.75 * inch
    text2 = f'First Page: {pageinfo}'
    canvas.drawString(x2, y2, text2)
    canvas.restoreState()

def laterPage(canvas, doc):
    canvas.saveState()
    canvas.setont('Times-Roman',9)
    x1 = inch
    y1 = 0.75 * inch
    text1 = f'Page {doc.page} {pageinfo}'
    canvas.drawString(x1, y1, text)
    canvas.restoreState()

def go():
    doc = SimpleDocTemplate('hello.pdf')
    Story = [Spacer(1, 2 * inch)] # list of flowables? (spacers, paragraphs, etc)
    style = styles["Normal"]
    for i in range(10):
        text1 = f'This is pararaph number {i}. ' * 5
        p1 = Paragraph(text1, style)
        Story.append(p1)
        Story.append(Spacer(1, 0.2 * inch))
    doc.build(Story, onFirstPage=firstPage, onLaterPages=laterPage)

# ---
# flowables (example)
# ---

style = styles['BodyText'] # styles is defined near import statements
p1 = Paragraph('This is a very silly example', style)
c = canvas.Canvas('hello.pdf')
aW = 460 # available width
aH = 800 # available height
w,h = P.wrap(aW, aH) # find required space
if w <= aW and h <= aH:
    p1.drawOn(c, 0, aH)
    aH = aH - h # reduce available height
    c.save()
else:
    raise ValueError, "Not enough room"

# flowable user methods
Flowable.draw() # used by 'drawOn'
Flowable.drawOn(canvas, x, y) # controlling programs use this method to render the flowable to a canvas.
Flowable.wrap(availWidth, availHeight) # called by the enclosing frame before objects are queried, drawn, etc.
Flowable.split(self, availWidth, availHeight) # confusing -- idk if i'll use
# flowable space methods (guidelines for flowable positioning)
Flowable.getSpaceAfter(self):
Flowable.getSpaceBefore(self):

# all flowables have an 'hAlign' property: ('LEFT', 'RIGHT', 'CENTER')
    # this determines horizontal placement for objects that are < full width of frame.

# ---
# frames
# ---

# frames -- active containers which are themselves contained in 'PageTemplates.Frames'.
    # they maintain a concept of remaining drawable space.

Frame(
    x1, y1, width, height, leftPadding=6, bottomPadding=6, rightPadding=6,
    topPadding=6, id=None, showBoundary=0
)
# creates a 'Frame' instance
    # lower left hand corner at coordinate (x1,y1)
    # dimensions (width, height)
    # padding -- reduce drawable area
    # id -- can be used as identifier at runtime
    # showBoundary -- non-zero value passed, boundary of frame will get drawn at runtime.

# frame user methods
Frame.addFromList(drawlist, canvas) # consumes 'Flowables' from 'drawlist' until frame is full. raises exception if no space
Frame.split(flowable,canv) # asks the flowable to split: uses up available space and returns list of flowables
Frame.drawBoundary(canvas) # draws the frame boundary as a rectangle (primarily for debugging)

# ---
# frames (example)
# ---

styleN = styles['Normal']
styleH = styles['Heading1']
story = []
story.append(Paragraph("This is a Heading", styleH))
story.append(Paragraph("This is a pragraph in <em>Normal</em> style.", styleN))
c = canvas.Canvas('hello.pdf')
f = Frame(x1=inch, y1=inch, width=6*inch, height=9*inch, showBoundary=1)
f.addFromList(story,c)
c.save()


# ---
# documents and templates
# ---

# the 'BaseDocTemplate' class implements the basic machinery for document formatting.
    # an instance contains a list of PageTemplates that can be used to describe the layout on a single page.
    # the 'build' method can be used to process a list of 'Flowables' to produce a pdf

BaseDocTemplate(
    self, 
    filename, # filename
    pagesize=defaultPageSize,
    pageTemplates=[],
    showBoundary=0, # non-zero values, Frame boundaries shown
    leftMargin=inch,
    rightMargin=inch,
    topMargin=inch,
    bottomMargin=inch,
    allowSplitting=1, # allow flowables to be split across frames
    title=None,
    author=None,
    _pageBreakQuick=1, # end all frames on current page before ending page.
    encrypt=None
)

# user BaseDocTemplate methods
BaseDocTemplate.addPageTemplates(self,pageTemplates) # add one or a list of PageTemplates
BaseDocTemplate.build(self, flowables, filename=None, canvasmaker=canvas.Canvas)

# user virtual BaseDocTemplate methods
BaseDocTemplate.afterInit(self)
BaseDocTemplate.afterPage(self)
BaseDocTemplate.beforeDocument(self)
BaseDocTemplate.beforePage(self)
BaseDocTemplate.filterFlowables(self,flowables)
BaseDocTemplate.afterFlowable(self, flowable)

# BaseDocTemplate event handler methods
    # skipped


# ---
# document templates example
# ---

styleN = styles['Normal']
styleH = styles['Heading1']
story = []
story.append(Paragraph("This is a Heading", styleH))
story.append(Paragraph("This is a paragraph in <em>Normal</em> style.", styleN))
doc = SimpleDocTemplate('hello.pdf', pagesize=letter)
doc.build(story)


# ---
# page templates
# ---

# skipped

# ---
# paragraphs
# ---

# instance of paragraph
    # text -- text of paragraph. excess white space is removed at beginning/ends of lines
    # style -- should be an instance of reportlab.lib.styles.ParagraphStyle
    # bulletText -- specify default bullet used
Paragraph(text, style, bulletText=None)

# ParagraphStyle
class ParagraphStyle(PropertySet):
    defaults = {
        'fontName':_baseFontName,
        'fontSize':10,
        'leading':12,
        'leftIndent':0,
        'rightIndent':0,
        'firstLineIndent':0,
        'alignment':TA_LEFT,
        'spaceBefore':0,
        'spaceAfter':0,
        'bulletFontName':_baseFontName,
        'bulletFontSize':10,
        'bulletIndent':0,
        'textColor': black,
        'backColor':None,
        'wordWrap':None,
        'borderWidth': 0,
        'borderPadding': 0,
        'borderColor': None,
        'borderRadius': None,
        'allowWidows': 1,
        'allowOrphans': 0,
        'textTransform':None,
        'endDots':None,
        'splitLongWords':1,
        'underlineWidth': _baseUnderlineWidth,
        'bulletAnchor': 'start',
        'justifyLastLine': 0,
        'justifyBreaks': 0,
        'spaceShrinkage': _spaceShrinkage,
        'strikeWidth': _baseStrikeWidth, #stroke width
        'underlineOffset': _baseUnderlineOffset, #fraction of fontsize to offset underlines
        'underlineGap': _baseUnderlineGap, #gap for double/triple underline
        'strikeOffset': _baseStrikeOffset,  #fraction of fontsize to offset strikethrough
        'strikeGap': _baseStrikeGap,        #gap for double/triple strike
        'linkUnderline': _platypus_link_underline,
        'hyphenationLang': _hyphenationLang,
        'uriWasteReduce': _uriWasteReduce,
        'embeddedHyphenation': _embeddedHyphenation,
    }

# ---
# tables
# ---

# the 'Table' and 'LongTable' classes derive from the 'Flowable' class. they are gridding mechanisms.
    # LongTable uses a greedy algorithm when calculating column widths and is intended for long tables where speed counts.
    # Table cells can hold anything which can be convered to a Python string, flowable, or list of flowables.
    # heights and widths can be worked out if not supplied
        # it is better if the width is set manually.

Table(
    data, # sequence of sequences of cell values (data[row][col])
    colWidths=None, # None, or a list of widths == # of columns
    rowHeights=None, # None, or a list of heights == # of rows
    style=None,
    splitByRow=1, # when rows/cols don't fit in their current context, split by row
    repeatRows=0, # number or tuple of leading rows that should be repeated when table is split
    repeatCols=0, # not implemented (splitByCol is not implemented yet)
    rowSplitRange=None,
    spaceBefore=None, # space before table (when rendered in a platypus story)
    spaceAfter=None # space after table (when rendered in a platypus story)
)

# TableStyle
Table.setStyle(tblStyle)

# TableStyle user methods

# command format:
    # identifier (string)
    # start/stop cell coordinates, (column, row)
    # optional thickness/colors/etc.

# TableStyle
TableStyle(commandSequence)
LIST_STYLE = TableStyle([
    ('LINEABOVE', (0,0), (-1,0), 2, colors.green),
    ('LINEABOVE', (0,1), (-1,-1), 0.25, colors.black),
    ('LINEBELOW', (0,-1), (-1,-1), 2, colors.green),
    ('ALIGN', (1,1), (-1,-1), 'RIGHT')
])
# TableStyle.add
TableStyle.add(commandSequence)
LIST_STYLE.add('BACKGROUND', (0,0), (-1,0), colors.Color(0,0.7,0.7))
# TableStyle.getCommands()
cmds = LIST_STYLE.getCommands()

# TableStyle cell formatting commands
# TableStyle line commands
# TableStyle span commands


# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




# ---
# 
# ---




