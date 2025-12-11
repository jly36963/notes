# typed: true
# frozen_string_literal: true

require 'sorbet-runtime'
extend T::Sig

sig { params(str: String).void }
# Print string in uppercase, surrounded by newlines
def print_section_title(str)
  puts("\n#{str.upcase}\n")
end
